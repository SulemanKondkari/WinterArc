"use client";

import { useActionState } from "react";
import { signupAction } from "@/app/actions/signup";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

export function SignupForm() {
  const [state, action] = useActionState(signupAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm uppercase font-bold" htmlFor="name">Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          className="border border-wab-black p-3 font-sans outline-none focus:ring-2 focus:ring-wab-yellow"
          required 
        />
        {state?.errors?.name && <p className="text-wab-red text-xs font-mono">{state.errors.name}</p>}
      </div>

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
        "w-full bg-wab-red text-wab-offwhite font-display text-2xl uppercase tracking-widest p-4 transition-colors",
        "hover:bg-wab-black hover:text-wab-offwhite",
        pending && "opacity-50 cursor-not-allowed"
      )}
    >
      {pending ? "Creating..." : "Create Account →"}
    </button>
  );
}
