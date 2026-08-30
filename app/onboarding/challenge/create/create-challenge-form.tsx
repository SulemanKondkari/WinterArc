"use client";

import { useActionState } from "react";
import { createChallengeAction } from "@/app/actions/challenge";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

export function CreateChallengeForm() {
  const [state, action] = useActionState(createChallengeAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm uppercase font-bold" htmlFor="durationDays">Duration (Days)</label>
        <select 
          id="durationDays" 
          name="durationDays" 
          defaultValue="90"
          className="border border-wab-black p-3 font-sans outline-none focus:ring-2 focus:ring-wab-yellow bg-white"
        >
          <option value="60">60 Days</option>
          <option value="90">90 Days (Default)</option>
        </select>
        {state?.errors?.durationDays && <p className="text-wab-red text-xs font-mono">{state.errors.durationDays}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm uppercase font-bold" htmlFor="startingLives">Starting Lives</label>
        <select 
          id="startingLives" 
          name="startingLives" 
          defaultValue="3"
          className="border border-wab-black p-3 font-sans outline-none focus:ring-2 focus:ring-wab-yellow bg-white"
        >
          <option value="1">1 Life (Hardcore)</option>
          <option value="3">3 Lives (Default)</option>
          <option value="5">5 Lives</option>
        </select>
        {state?.errors?.startingLives && <p className="text-wab-red text-xs font-mono">{state.errors.startingLives}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm uppercase font-bold" htmlFor="allowedRestDays">Allowed Rest Days / Week</label>
        <select 
          id="allowedRestDays" 
          name="allowedRestDays" 
          defaultValue="2"
          className="border border-wab-black p-3 font-sans outline-none focus:ring-2 focus:ring-wab-yellow bg-white"
        >
          <option value="0">0 (Every day)</option>
          <option value="1">1 Rest Day</option>
          <option value="2">2 Rest Days (Default)</option>
          <option value="3">3 Rest Days</option>
        </select>
        {state?.errors?.allowedRestDays && <p className="text-wab-red text-xs font-mono">{state.errors.allowedRestDays}</p>}
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
        "hover:bg-wab-yellow hover:text-wab-black mt-4",
        pending && "opacity-50 cursor-not-allowed"
      )}
    >
      {pending ? "Creating..." : "Set Contract →"}
    </button>
  );
}
