"use client";

import { useActionState } from "react";
import { setContractAction } from "@/app/actions/contract";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { SignaturePad } from "@/components/ui/signature-pad";

export function ContractForm({ challengeId }: { challengeId: string }) {
  const [state, action] = useActionState(setContractAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="challengeId" value={challengeId} />
      
      <div className="flex flex-col gap-2">
        <textarea 
          id="text" 
          name="text" 
          placeholder="e.g., Buy my friend dinner, donate $100, do 1000 burpees..."
          className="border border-wab-black p-4 font-mono text-lg outline-none focus:ring-2 focus:ring-wab-yellow bg-wab-offwhite/50 resize-none h-32"
          required 
        />
        {state?.errors?.text && <p className="text-wab-red text-xs font-mono">{state.errors.text}</p>}
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
      {pending ? "Signing..." : "Sign & Invite Friend →"}
    </button>
  );
}
