import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function ChallengeDecisionPage() {
  const { data: _authData } = await auth.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="w-full max-w-xl border border-wab-black bg-white">
      <div className="p-8 border-b border-wab-black bg-wab-black text-wab-offwhite">
        <h1 className="font-display text-4xl uppercase tracking-tighter leading-none mb-2">
          Step 02 /<br />Create or Join
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest opacity-80">
          Start a new arc or join a friend
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-wab-black">
        <Link href="/onboarding/challenge/create" className="group flex flex-col items-center justify-center p-8 md:p-12 hover:bg-wab-black hover:text-wab-offwhite transition-colors min-h-[300px]">
          <h2 className="font-display text-4xl uppercase tracking-tighter mb-4 text-center">
            Create<br />Challenge <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
          </h2>
          <span className="font-mono text-xs uppercase text-center opacity-70">
            Set the rules and invite a friend
          </span>
        </Link>
        <Link href="/onboarding/challenge/join" className="group flex flex-col items-center justify-center p-8 md:p-12 bg-wab-offwhite hover:bg-wab-yellow transition-colors min-h-[300px]">
          <h2 className="font-display text-4xl uppercase tracking-tighter mb-4 text-center">
            Join With<br />Code <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
          </h2>
          <span className="font-mono text-xs uppercase text-center opacity-70">
            Enter an invite code
          </span>
        </Link>
      </div>
    </div>
  );
}
