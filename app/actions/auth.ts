"use server";

import { auth } from "@/lib/auth/server";
import { z } from "zod";
import { redirect } from "next/navigation";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = LoginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Login.",
    };
  }

  try {
    const { error } = await auth.signIn.email({
      email,
      password,
    });

    if (error) {
      return { message: error.message || "Invalid credentials." };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { message: "Something went wrong." };
  }

  redirect("/dashboard");
}
