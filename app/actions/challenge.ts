"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import crypto from "crypto";

const ChallengeSchema = z.object({
  durationDays: z.coerce.number().min(30).max(365),
  startingLives: z.coerce.number().min(1).max(10),
  allowedRestDays: z.coerce.number().min(0).max(7),
});

export async function createChallengeAction(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Unauthorized." };
  }

  const durationDays = formData.get("durationDays");
  const startingLives = formData.get("startingLives");
  const allowedRestDays = formData.get("allowedRestDays");

  const validatedFields = ChallengeSchema.safeParse({ durationDays, startingLives, allowedRestDays });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid configuration.",
    };
  }

  let challengeId = "";

  try {
    // Generate unique 6-character code
    const inviteCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    const challenge = await prisma.challenge.create({
      data: {
        inviteCode,
        durationDays: validatedFields.data.durationDays,
        startingLives: validatedFields.data.startingLives,
        allowedRestDays: validatedFields.data.allowedRestDays,
        status: "DRAFT",
        members: {
          create: {
            userId: session.user.id,
            lives: validatedFields.data.startingLives,
          }
        }
      },
    });

    challengeId = challenge.id;
  } catch (error) {
    console.error("Challenge creation error:", error);
    return { message: "Failed to create challenge." };
  }

  redirect(`/onboarding/contract/${challengeId}`);
}
