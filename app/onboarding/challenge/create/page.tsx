import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { CreateChallengeForm } from "./create-challenge-form";

export default async function CreateChallengePage() {
  const { data: _authData } = await auth.getSession();
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="w-full max-w-xl border border-wab-black bg-white">
      <div className="p-8 border-b border-wab-black bg-wab-black text-wab-offwhite">
        <h1 className="font-display text-4xl uppercase tracking-tighter leading-none mb-2">
          Step 03 /<br />Configuration
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest opacity-80">
          Set the rules of the Winter Arc
        </p>
      </div>
      
      <div className="p-8">
        <CreateChallengeForm />
      </div>
    </div>
  );
}
