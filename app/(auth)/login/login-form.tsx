"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Please fill in all fields.");
      setPending(false);
      return;
    }

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials.");
        setPending(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm uppercase font-bold" htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          className="border border-wab-black p-3 font-sans outline-none focus:ring-2 focus:ring-wab-yellow"
          required 
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm uppercase font-bold" htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          className="border border-wab-black p-3 font-sans outline-none focus:ring-2 focus:ring-wab-yellow"
          required 
        />
      </div>

      {error && <p className="text-wab-red text-sm font-mono font-bold">{error}</p>}

      <button 
        type="submit" 
        disabled={pending}
        className={cn(
          "w-full bg-wab-black text-wab-offwhite font-display text-2xl uppercase tracking-widest p-4 transition-colors",
          "hover:bg-wab-yellow hover:text-wab-black",
          pending && "opacity-50 cursor-not-allowed"
        )}
      >
        {pending ? "Authenticating..." : "Login →"}
      </button>
    </form>
  );
}
