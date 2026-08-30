"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";

const ContractSchema = z.object({
  challengeId: z.string().min(1),
  text: z.string().min(10, { message: "Contract must be at least 10 characters." }),
});

export async function setContractAction(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { message: "Unauthorized." };

  const challengeId = formData.get("challengeId") as string;
  const text = formData.get("text") as string;

  const validatedFields = ContractSchema.safeParse({ challengeId, text });

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
      }
    });

  } catch (error) {
    console.error("Contract creation error:", error);
    return { message: "Failed to save contract." };
  }

  redirect(`/onboarding/invite/${challengeId}`);
}
