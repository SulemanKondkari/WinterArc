"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function reviewProofAction(proofId: string, decision: "APPROVED" | "REJECTED", reason?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  try {
    const proof = await prisma.proofSubmission.findUnique({
      where: { id: proofId },
      include: { 
        challenge: { include: { members: true } },
        dailyEntry: true
      }
    });

    if (!proof) return { error: "Proof not found." };

    // Verify user is in challenge but not the owner of proof
    const isMember = proof.challenge.members.some(m => m.userId === session.user?.id);
    if (!isMember || proof.userId === session.user?.id) {
      return { error: "Unauthorized to review this proof." };
    }

    // Create review
    await prisma.proofReview.create({
      data: {
        proofSubmissionId: proof.id,
        reviewerId: session.user.id,
        decision,
        reason
      }
    });

    // Update proof status
    await prisma.proofSubmission.update({
      where: { id: proofId },
      data: { status: decision }
    });

    // Update daily entry status
    await prisma.dailyEntry.update({
      where: { id: proof.dailyEntryId },
      data: { status: decision === "APPROVED" ? "WORKOUT_APPROVED" : "WORKOUT_REJECTED" }
    });

    // If rejected, remove life
    if (decision === "REJECTED") {
      const targetMember = proof.challenge.members.find(m => m.userId === proof.userId);
      if (targetMember && targetMember.lives > 0) {
        await prisma.challengeMember.update({
          where: { id: targetMember.id },
          data: { lives: targetMember.lives - 1 }
        });
        
        await prisma.lifeEvent.create({
          data: {
            userId: targetMember.userId,
            challengeId: targetMember.challengeId,
            previousBalance: targetMember.lives,
            amount: -1,
            newBalance: targetMember.lives - 1,
            reason: "Proof rejected by partner: " + (reason || "No reason given"),
            source: "SYSTEM"
          }
        });
      }
    }

    revalidatePath("/dashboard");
    return { success: true };

  } catch (error) {
    console.error("Review error:", error);
    return { error: "Failed to submit review." };
  }
}
