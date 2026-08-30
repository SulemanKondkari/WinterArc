"use client";

import { useActionState } from "react";
import { agreeContractAction } from "@/app/actions/agree";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { SignaturePad } from "@/components/ui/signature-pad";

export function AgreeForm({ challengeId }: { challengeId: string }) {
  const [state, action] = useActionState(agreeContractAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-6 w-full">
      <input type="hidden" name="challengeId" value={challengeId} />
      
      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-4 p-4 border-2 border-wab-black bg-wab-offwhite cursor-pointer hover:bg-wab-yellow transition-colors">
          <input 
            type="checkbox" 
            name="agree"
            className="mt-1 w-6 h-6 border-2 border-wab-black rounded-none checked:bg-wab-black checked:text-wab-yellow appearance-none cursor-pointer flex items-center justify-center after:content-['✓'] after:text-white after:opacity-0 checked:after:opacity-100 transition-all shrink-0"
            required
          />
          <span className="font-sans text-sm md:text-lg font-bold leading-tight mt-1">
          I accept the contract and the rules of the challenge. I understand that failure will result in the above forfeit.
          </span>
        </label>
        {state?.errors?.agree && <p className="text-wab-red text-xs font-mono">{state.errors.agree}</p>}
      </div>

      <SignaturePad name="signature" />
      {state?.errors?.signature && <p className="text-wab-red text-xs font-mono">{state.errors.signature}</p>}

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
