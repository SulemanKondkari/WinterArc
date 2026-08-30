import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AgreeForm } from "./agree-form";

export default async function AgreeContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: _authData } = await auth.getSession();
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) redirect("/login");

  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: { contract: true, members: true }
  });

  if (!challenge || !challenge.contract) redirect("/dashboard");

  const isMember = challenge.members.some(m => m.userId === session.user?.id);
  if (!isMember) redirect("/dashboard");

  if (challenge.status === "ACTIVE") redirect("/dashboard");

  return (
    <div className="w-full max-w-2xl border border-wab-black bg-white">
      <div className="p-8 border-b border-wab-black bg-wab-red text-wab-offwhite">
        <h1 className="font-display text-5xl uppercase tracking-tighter leading-none mb-2">
          Step 04 /<br />The Contract
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest">
          Accept the stakes
        </p>
      </div>
      
      <div className="p-8 border-b border-wab-black bg-wab-offwhite">
        <p className="font-mono text-sm uppercase opacity-70 mb-2">If I lose, I will:</p>
        <p className="font-sans text-2xl font-bold">&quot;{challenge.contract.text}&quot;</p>
      </div>

      <div className="p-8">
        <AgreeForm challengeId={id} />
      </div>
    </div>
  );
}
