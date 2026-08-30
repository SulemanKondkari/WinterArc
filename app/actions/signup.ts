"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { z } from "zod";
import { redirect } from "next/navigation";

const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export async function signupAction(prevState: unknown, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = SignupSchema.safeParse({ name, email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Signup.",
    };
  }

  try {
    const { data, error } = await auth.signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      return { message: error.message || "Failed to create account. Please try again." };
    }

    if (data?.user) {
      // Sync user to Prisma for foreign keys
      await prisma.user.create({
        data: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        },
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return { message: "Failed to create account. Please try again." };
  }

  redirect("/login");
}
