import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { JoinForm } from "./join-form";

export default async function JoinChallengePage() {
  const { data: _authData } = await auth.getSession();
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="w-full max-w-xl border border-wab-black bg-white flex flex-col">
      <div className="p-8 border-b border-wab-black bg-wab-black text-wab-offwhite">
        <h1 className="font-display text-4xl uppercase tracking-tighter leading-none mb-2">
          Step 03 /<br />Join Arc
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest opacity-80">
          Enter your friend&apos;s invite code
        </p>
      </div>
      
      <div className="p-8">
        <JoinForm />
      </div>
    </div>
  );
}
