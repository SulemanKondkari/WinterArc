import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: _authData } = await auth.getSession();
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) redirect("/login");

  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: { members: true }
  });

  if (!challenge) redirect("/dashboard");
  
  const isMember = challenge.members.some(m => m.userId === session.user?.id);
  if (!isMember) redirect("/dashboard");

  // If already active or waiting, behavior changes
  if (challenge.status === "ACTIVE") redirect("/dashboard");

  return (
    <div className="w-full max-w-xl border border-wab-black bg-white flex flex-col">
      <div className="p-8 border-b border-wab-black bg-wab-yellow text-wab-black">
        <h1 className="font-display text-5xl uppercase tracking-tighter leading-none mb-2">
          Step 05 /<br />Invite
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest font-bold">
          Waiting for partner...
        </p>
      </div>
      
      <div className="p-12 flex flex-col items-center justify-center border-b border-wab-black bg-wab-offwhite">
        <span className="font-mono text-sm uppercase font-bold mb-4">Your Invite Code</span>
        <div className="font-display text-7xl md:text-8xl tracking-widest bg-white border-2 border-wab-black p-4 select-all">
          {challenge.inviteCode}
        </div>
      </div>

      <div className="p-8 flex flex-col gap-4 items-center">
        <p className="font-sans text-center max-w-sm mb-4">
          Share this code with your accountability partner. They must enter it on the &quot;Join&quot; screen.
        </p>
        
        <Link href="/dashboard" className="w-full bg-wab-black text-wab-offwhite font-display text-2xl uppercase tracking-widest p-4 text-center hover:bg-wab-red transition-colors">
          Go To Dashboard →
        </Link>
      </div>
    </div>
  );
}
