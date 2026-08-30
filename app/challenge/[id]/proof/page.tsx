import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CameraCapture } from "./camera-capture";

export default async function ProofPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: _authData } = await auth.getSession();
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) redirect("/login");

  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: { members: true }
  });

  if (!challenge || challenge.status !== "ACTIVE") redirect("/dashboard");
  
  const isMember = challenge.members.some(m => m.userId === session.user?.id);
  if (!isMember) redirect("/dashboard");

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-wab-black text-wab-offwhite">
      <nav className="w-full flex items-center justify-between p-4 border-b border-wab-offwhite/20">
        <div className="font-display text-2xl font-bold tracking-tighter text-wab-yellow">WAB.</div>
        <div className="font-mono text-xs uppercase tracking-widest font-bold">
          Submit Proof
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center p-4">
        <h1 className="font-display text-5xl uppercase tracking-tighter mt-8 mb-2">
          Daily Proof
        </h1>
        <p className="font-mono text-xs uppercase opacity-70 mb-8 tracking-widest">
          Snap your workout
        </p>

        <div className="w-full max-w-lg">
          <CameraCapture challengeId={id} />
        </div>
      </div>
    </main>
  );
}
