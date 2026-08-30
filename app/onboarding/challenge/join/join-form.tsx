"use client";

import { useActionState } from "react";
import { joinChallengeAction } from "@/app/actions/join";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

export function JoinForm() {
  const [state, action] = useActionState(joinChallengeAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm uppercase font-bold" htmlFor="code">Invite Code</label>
        <input 
          type="text" 
          id="code" 
          name="code" 
          placeholder="e.g. WA7K9P"
          className="border border-wab-black p-4 font-display text-4xl tracking-widest uppercase outline-none focus:ring-2 focus:ring-wab-yellow text-center"
          required 
          maxLength={6}
        />
        {state?.errors?.code && <p className="text-wab-red text-xs font-mono">{state.errors.code}</p>}
      </div>

      {state?.message && <p className="text-wab-red text-sm font-mono font-bold text-center">{state.message}</p>}

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
        "w-full bg-wab-yellow text-wab-black font-display text-2xl uppercase tracking-widest p-4 transition-colors",
        "hover:bg-wab-black hover:text-wab-yellow mt-4 border border-wab-black",
        pending && "opacity-50 cursor-not-allowed"
      )}
    >
      {pending ? "Joining..." : "Join Challenge →"}
    </button>
  );
}
