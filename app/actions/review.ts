"use server";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function reviewProofAction(proofId: string, decision: "APPROVED" | "REJECTED" | "REST" | "RESET", reason?: string) {
  const { data: _authData } = await auth.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });
  const session = _authData ? { user: _authData.user } : null;
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

    if (decision === "RESET") {
      await prisma.$transaction([
        prisma.proofSubmission.delete({
          where: { id: proof.id }
        }),
        prisma.dailyEntry.update({
          where: { id: proof.dailyEntryId },
          data: { status: "PENDING" }
        })
      ]);
      
      revalidatePath("/dashboard");
      return { success: true };
    }

    if (decision === "REST") {
      const targetMember = proof.challenge.members.find(m => m.userId === proof.userId);
      if (!targetMember) return { error: "Member not found." };

      // Count existing rest days
      const existingRestDays = await prisma.restDay.count({
        where: { userId: targetMember.userId, challengeId: targetMember.challengeId }
      });

      const exceedsAllowed = existingRestDays >= proof.challenge.allowedRestDays;

      // Create RestDay record
      await prisma.restDay.create({
        data: {
          userId: targetMember.userId,
          challengeId: targetMember.challengeId,
          date: proof.dailyEntry.date,
          causedLifeLoss: exceedsAllowed
        }
      });

      if (exceedsAllowed && targetMember.lives > 0) {
        // Deduct life
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
            reason: "Exceeded allowed rest days.",
            source: "SYSTEM"
          }
        });
      }

      await prisma.proofSubmission.update({
        where: { id: proof.id },
        data: { status: "REST" }
      });
      
      await prisma.dailyEntry.update({
        where: { id: proof.dailyEntryId },
        data: { status: "REST" }
      });
      
      revalidatePath("/dashboard");
      return { success: true };
    }

    // Standard Approved/Rejected Flow
    await prisma.proofReview.create({
      data: {
        proofSubmissionId: proof.id,
        reviewerId: session.user.id,
        decision,
        reason
      }
    });

    await prisma.proofSubmission.update({
      where: { id: proofId },
      data: { status: decision }
    });

    await prisma.dailyEntry.update({
      where: { id: proof.dailyEntryId },
      data: { status: decision === "APPROVED" ? "WORKOUT_APPROVED" : "WORKOUT_REJECTED" }
    });

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
