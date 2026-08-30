"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";

const JoinSchema = z.object({
  code: z.string().length(6, { message: "Code must be exactly 6 characters." }).toUpperCase(),
});

export async function joinChallengeAction(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { message: "Unauthorized." };

  const code = formData.get("code") as string;
  const validatedFields = JoinSchema.safeParse({ code });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid code format.",
    };
  }

  let challengeId = "";

  try {
    const challenge = await prisma.challenge.findUnique({
      where: { inviteCode: validatedFields.data.code },
      include: { members: true }
    });

    if (!challenge) {
      return { message: "Challenge not found." };
    }

    if (challenge.members.length >= 2) {
      return { message: "Challenge is already full." };
    }

    const isAlreadyMember = challenge.members.some(m => m.userId === session.user?.id);
    
    if (!isAlreadyMember) {
      await prisma.challengeMember.create({
        data: {
          userId: session.user.id,
          challengeId: challenge.id,
          lives: challenge.startingLives,
        }
      });
      
      // If this is the second member, update status to WAITING_FOR_PARTNER or ACTIVE depending on contract
      if (challenge.members.length === 1) {
        await prisma.challenge.update({
          where: { id: challenge.id },
          data: { status: "WAITING_FOR_PARTNER" } // Partner needs to agree to contract
        });
      }
    }

    challengeId = challenge.id;
  } catch (error) {
    console.error("Join challenge error:", error);
    return { message: "Failed to join challenge." };
  }

  // Redirect to the contract agreement page for the joiner
  redirect(`/onboarding/contract/${challengeId}/agree`);
}
