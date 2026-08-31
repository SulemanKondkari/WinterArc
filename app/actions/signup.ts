"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

export async function syncUserToDatabase() {
  try {
    // Get the current session using the auth instance
    const session = await auth.getSession({
      fetchOptions: {
        headers: await headers()
      }
    });
    
    if (!session?.user) {
      return { success: false, message: "No session found" };
    }

    const { id, name, email } = session.user;

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      await prisma.user.create({
        data: {
          id,
          name,
          email,
        },
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to sync user:", error);
    return { success: false, message: "Failed to sync user" };
  }
}

