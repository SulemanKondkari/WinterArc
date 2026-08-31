import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ContractForm } from "./contract-form";

export default async function ContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: _authData } = await auth.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) redirect("/login");

  const membership = await prisma.challengeMember.findUnique({
    where: {
      userId_challengeId: {
        userId: session.user.id,
        challengeId: id
      }
    },
    include: { challenge: true }
  });

  if (!membership) redirect("/onboarding/challenge");

  return (
    <div className="w-full max-w-2xl border border-wab-black bg-white">
      <div className="p-8 border-b border-wab-black bg-wab-red text-wab-offwhite">
        <h1 className="font-display text-5xl uppercase tracking-tighter leading-none mb-2">
          Step 04 /<br />The Contract
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest">
          Establish the stakes
        </p>
      </div>
      
      <div className="p-8">
        <p className="font-sans text-xl font-bold mb-6">
          &quot;If I lose this Winter Arc, I will...&quot;
        </p>
        <ContractForm challengeId={id} />
      </div>
    </div>
  );
}
