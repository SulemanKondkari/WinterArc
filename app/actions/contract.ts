"use server";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";

const ContractSchema = z.object({
  challengeId: z.string().min(1),
  text: z.string().min(10, { message: "Contract must be at least 10 characters." }),
  signature: z.string().min(20, { message: "Please provide a signature." }),
});

export async function setContractAction(prevState: unknown, formData: FormData) {
  const { data: _authData } = await auth.getSession();
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) return { message: "Unauthorized." };

  const challengeId = formData.get("challengeId") as string;
  const text = formData.get("text") as string;
  const signature = formData.get("signature") as string;

  const validatedFields = ContractSchema.safeParse({ challengeId, text, signature });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid contract.",
    };
  }

  try {
    const membership = await prisma.challengeMember.findUnique({
      where: { userId_challengeId: { userId: session.user.id, challengeId } }
    });

    if (!membership) return { message: "Unauthorized." };

    await prisma.challengeContract.create({
      data: {
        challengeId,
        text: validatedFields.data.text,
        signature1: validatedFields.data.signature,
      }
    });

  } catch (error) {
    console.error("Contract creation error:", error);
    return { message: "Failed to save contract." };
  }

  redirect(`/onboarding/invite/${challengeId}`);
}
