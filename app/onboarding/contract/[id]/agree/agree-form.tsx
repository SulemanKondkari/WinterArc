"use client";

import { useActionState } from "react";
import { agreeContractAction } from "@/app/actions/agree";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

export function AgreeForm({ challengeId }: { challengeId: string }) {
  const [state, action] = useActionState(agreeContractAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="challengeId" value={challengeId} />
      
      <div className="flex gap-4 items-start">
        <input 
          type="checkbox" 
          id="agree" 
          name="agree" 
          className="mt-1 w-6 h-6 border-2 border-wab-black accent-wab-red outline-none focus:ring-2 focus:ring-wab-yellow"
          required 
        />
        <label htmlFor="agree" className="font-sans text-lg font-bold">
          I accept the contract and the rules of the challenge. I understand that failure will result in the above forfeit.
        </label>
      </div>
      {state?.errors?.agree && <p className="text-wab-red text-xs font-mono">{state.errors.agree}</p>}

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
        "hover:bg-wab-yellow hover:text-wab-black mt-4",
        pending && "opacity-50 cursor-not-allowed"
      )}
    >
      {pending ? "Accepting..." : "Accept & Start Arc →"}
    </button>
  );
}
