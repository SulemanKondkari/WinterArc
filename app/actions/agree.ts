"use server";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const AgreeSchema = z.object({
  challengeId: z.string().min(1),
  agree: z.string().refine(val => val === "on", { message: "You must agree to the contract." }),
  signature: z.string().min(20, { message: "Please provide a signature." }),
});

export async function agreeContractAction(prevState: unknown, formData: FormData) {
  const { data: _authData } = await auth.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) return { message: "Unauthorized." };

  const challengeId = formData.get("challengeId") as string;
  const agree = formData.get("agree") as string;
  const signature = formData.get("signature") as string;

  const validatedFields = AgreeSchema.safeParse({ challengeId, agree, signature });

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
        data: { 
          agreedByBoth: true,
          signature2: validatedFields.data.signature
        }
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
