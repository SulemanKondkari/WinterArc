"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

export function LoginForm() {
  const [state, action] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm uppercase font-bold" htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          className="border border-wab-black p-3 font-sans outline-none focus:ring-2 focus:ring-wab-yellow"
          required 
        />
        {state?.errors?.email && <p className="text-wab-red text-xs font-mono">{state.errors.email}</p>}
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
        {state?.errors?.password && <p className="text-wab-red text-xs font-mono">{state.errors.password}</p>}
      </div>

      {state?.message && <p className="text-wab-red text-sm font-mono font-bold">{state.message}</p>}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
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
  );
}
