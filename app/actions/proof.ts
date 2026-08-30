"use server";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { uploadMedia } from "@/lib/storage";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProofSchema = z.object({
  challengeId: z.string().min(1),
  workoutType: z.string().min(1),
  notes: z.string().optional(),
});

export async function submitProofAction(formData: FormData) {
  const { data: _authData } = await auth.getSession();
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) return { error: "Unauthorized." };

  const image = formData.get("image") as File;
  const challengeId = formData.get("challengeId") as string;
  const workoutType = formData.get("workoutType") as string;
  const notes = formData.get("notes") as string;

  if (!image) return { error: "Image is required." };

  const validatedFields = ProofSchema.safeParse({ challengeId, workoutType, notes });
  
  if (!validatedFields.success) {
    return { error: "Invalid form data." };
  }

  try {
    const membership = await prisma.challengeMember.findUnique({
      where: { userId_challengeId: { userId: session.user.id, challengeId } },
      include: { user: true }
    });

    if (!membership) return { error: "Not part of this challenge." };

    const { toZonedTime } = await import("date-fns-tz");
    const { startOfDay } = await import("date-fns");
    const TIMEZONE = "Asia/Kolkata";
    const nowIST = toZonedTime(new Date(), TIMEZONE);
    const todayIST = startOfDay(nowIST);
    
    let dailyEntry = await prisma.dailyEntry.findUnique({
      where: {
        userId_challengeId_date: {
          userId: session.user.id,
          challengeId,
          date: todayIST
        }
      }
    });

    if (!dailyEntry) {
      dailyEntry = await prisma.dailyEntry.create({
        data: {
          userId: session.user.id,
          challengeId,
          date: todayIST,
          status: "PENDING"
        }
      });
    }

    if (dailyEntry.status === "WORKOUT_APPROVED" || dailyEntry.status === "REST" || dailyEntry.status === "AWAITING_PARTNER_REVIEW") {
      return { error: "You have already submitted a proof for today." };
    }

    // Process image
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const media = await uploadMedia(buffer, image.type, "proof");

    // Save to DB
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        ownerId: session.user.id,
        challengeId,
        storageKey: media.key,
        mimeType: image.type,
        sizeBytes: media.size,
        type: "PROOF"
      }
    });

    await prisma.proofSubmission.create({
      data: {
        userId: session.user.id,
        challengeId,
        dailyEntryId: dailyEntry.id,
        mediaAssetId: mediaAsset.id,
        workoutType: validatedFields.data.workoutType,
        notes: validatedFields.data.notes,
        status: "AWAITING_PARTNER_REVIEW"
      }
    });

    // Update daily entry status
    await prisma.dailyEntry.update({
      where: { id: dailyEntry.id },
      data: { status: "AWAITING_PARTNER_REVIEW" } // You might want this in the schema, but PENDING works too if we consider the proof submission as the source of truth
    });

  } catch (error) {
    console.error("Proof submission error:", error);
    return { error: "Internal server error." };
  }

  redirect("/dashboard");
}
