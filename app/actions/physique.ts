"use server";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { uploadMedia } from "@/lib/storage";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function submitPhysiqueAction(formData: FormData) {
  const { data: _authData } = await auth.getSession();
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) return { error: "Unauthorized." };

  const image = formData.get("image") as File;
  const challengeId = formData.get("challengeId") as string;
  
  if (!image) return { error: "Image is required." };

  try {
    const membership = await prisma.challengeMember.findUnique({
      where: { userId_challengeId: { userId: session.user.id, challengeId } },
    });

    if (!membership) return { error: "Not part of this challenge." };

    // Process image
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const media = await uploadMedia(buffer, image.type, "physique");

    // Save to DB
    await prisma.mediaAsset.create({
      data: {
        ownerId: session.user.id,
        challengeId,
        storageKey: media.key,
        mimeType: image.type,
        sizeBytes: media.size,
        type: "PHYSIQUE"
      }
    });

  } catch (error) {
    console.error("Physique submission error:", error);
    return { error: "Internal server error." };
  }

  redirect(`/challenge/${challengeId}/physique`);
}
