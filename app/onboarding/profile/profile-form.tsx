"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/actions/onboarding";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

export function ProfileForm({ initialData }: { initialData: { username: string, timezone: string } }) {
  const [state, action] = useActionState(updateProfileAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm uppercase font-bold" htmlFor="username">Username</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          defaultValue={initialData.username}
          className="border border-wab-black p-3 font-sans outline-none focus:ring-2 focus:ring-wab-yellow"
          required 
        />
        {state?.errors?.username && <p className="text-wab-red text-xs font-mono">{state.errors.username}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm uppercase font-bold" htmlFor="timezone">Timezone</label>
        <select 
          id="timezone" 
          name="timezone" 
          defaultValue={initialData.timezone}
          className="border border-wab-black p-3 font-sans outline-none focus:ring-2 focus:ring-wab-yellow bg-white"
          required 
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="Europe/London">London (GMT/BST)</option>
          <option value="Europe/Paris">Central European Time (CET)</option>
          <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
          <option value="Australia/Sydney">Australian Eastern Time (AET)</option>
        </select>
        {state?.errors?.timezone && <p className="text-wab-red text-xs font-mono">{state.errors.timezone}</p>}
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
      {pending ? "Saving..." : "Continue →"}
    </button>
  );
}
