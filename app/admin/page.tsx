import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function AdminDashboardPage() {
  const { data: _authData } = await auth.getSession();
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.email) redirect("/login");

  // Basic authorization: Only the admin email (you can change this to a role column)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
  
  // NOTE: For demonstration purposes in development we allow any user, but in prod we restrict
  if (process.env.NODE_ENV === "production" && session.user.email !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  const flaggedProofs = await prisma.proofSubmission.findMany({
    where: { 
      status: "REJECTED" // Or FLAGGED if we added ML flagging
    },
    include: {
      user: true,
      mediaAsset: true,
      challenge: true,
    },
    orderBy: { createdAt: "desc" }
  });

  const totalUsers = await prisma.user.count();
  const totalActiveChallenges = await prisma.challenge.count({ where: { status: "ACTIVE" } });

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-wab-black text-wab-offwhite">
      <nav className="w-full flex items-center justify-between p-4 border-b border-wab-offwhite/20">
        <div className="font-display text-2xl font-bold tracking-tighter text-wab-yellow">WAB. ADMIN</div>
      </nav>

      <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="border border-wab-offwhite/20 p-6 bg-neutral-900">
            <span className="font-mono text-xs uppercase opacity-70">Total Users</span>
            <div className="font-display text-4xl">{totalUsers}</div>
          </div>
          <div className="border border-wab-offwhite/20 p-6 bg-neutral-900">
            <span className="font-mono text-xs uppercase opacity-70">Active Arcs</span>
            <div className="font-display text-4xl">{totalActiveChallenges}</div>
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col gap-4">
          <h2 className="font-display text-3xl uppercase tracking-tighter">Rejected / Flagged Proofs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flaggedProofs.map(proof => (
              <div key={proof.id} className="border border-wab-offwhite/20 bg-neutral-900 flex flex-col">
                <div className="relative aspect-video w-full border-b border-wab-offwhite/20">
                  {proof.mediaAsset && (
                    <Image 
                      src={proof.mediaAsset.storageKey}
                      alt="Proof"
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="p-4 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-xs uppercase opacity-70">{proof.user.name}</span>
                    <span className="font-mono text-xs text-wab-red uppercase font-bold">{proof.status}</span>
                  </div>
                  <span className="font-sans text-sm">{proof.workoutType}: {proof.notes}</span>
                </div>
              </div>
            ))}

            {flaggedProofs.length === 0 && (
              <div className="col-span-full py-12 text-center font-mono text-sm uppercase opacity-50 border border-wab-offwhite/20 border-dashed">
                Queue is clear.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
