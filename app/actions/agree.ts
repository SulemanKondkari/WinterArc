"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";

const AgreeSchema = z.object({
  challengeId: z.string().min(1),
  agree: z.string().refine(val => val === "on", { message: "You must agree to the contract." }),
});

export async function agreeContractAction(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { message: "Unauthorized." };

  const challengeId = formData.get("challengeId") as string;
  const agree = formData.get("agree") as string;

  const validatedFields = AgreeSchema.safeParse({ challengeId, agree });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "You must accept the terms.",
    };
  }

  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: { members: true, contract: true }
    });

    if (!challenge || !challenge.contract) return { message: "Challenge or contract not found." };

    const isMember = challenge.members.some(m => m.userId === session.user?.id);
    if (!isMember) return { message: "Unauthorized." };

    // Update contract and challenge to ACTIVE
    await prisma.$transaction([
      prisma.challengeContract.update({
        where: { challengeId },
        data: { agreedByBoth: true }
      }),
      prisma.challenge.update({
        where: { id: challengeId },
        data: { 
          status: "ACTIVE",
          startDate: new Date(),
          endDate: new Date(Date.now() + challenge.durationDays * 24 * 60 * 60 * 1000)
        }
      })
    ]);

  } catch (error) {
    console.error("Contract agreement error:", error);
    return { message: "Failed to accept contract." };
  }

  redirect(`/dashboard`);
}
