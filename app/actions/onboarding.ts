"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";

const ProfileSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  timezone: z.string().min(1, { message: "Timezone is required." }),
});

export async function updateProfileAction(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Unauthorized." };
  }

  const username = formData.get("username") as string;
  const timezone = formData.get("timezone") as string;

  const validatedFields = ProfileSchema.safeParse({ username, timezone });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Profile.",
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return { message: "Username is already taken." };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { username, timezone },
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return { message: "Failed to update profile. Please try again." };
  }

  redirect("/onboarding/challenge");
}
