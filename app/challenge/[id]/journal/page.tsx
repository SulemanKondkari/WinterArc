import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

export default async function JournalPage({ params }: { params: Promise<{ id: string }> }) {
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

  const proofs = await prisma.proofSubmission.findMany({
    where: { challengeId: id },
    include: { user: true, mediaAsset: true, dailyEntry: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-wab-offwhite">
      <nav className="w-full flex items-center justify-between p-4 border-b border-wab-black">
        <Link href="/dashboard" className="font-display text-2xl font-bold tracking-tighter hover:text-wab-red">WAB.</Link>
        <div className="font-mono text-xs uppercase tracking-widest font-bold">
          Training Journal
        </div>
      </nav>

      <div className="flex-1 p-4 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-end border-b border-wab-black pb-4">
          <div>
            <h1 className="font-display text-6xl uppercase tracking-tighter leading-none">Journal</h1>
            <p className="font-mono text-sm uppercase opacity-70 mt-2">All recorded entries for this arc</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proofs.map(proof => (
            <div key={proof.id} className="border border-wab-black bg-white flex flex-col">
              <div className="relative aspect-[3/4] w-full border-b border-wab-black bg-neutral-900">
                {proof.mediaAsset && (
                  <Image 
                    src={proof.mediaAsset.storageKey}
                    alt="Workout Proof"
                    fill
                    className="object-cover"
                  />
                )}
                <div className={`absolute top-2 right-2 px-3 py-1 font-mono text-xs uppercase font-bold tracking-widest text-wab-offwhite ${proof.status === 'APPROVED' ? 'bg-wab-black' : proof.status === 'REJECTED' ? 'bg-wab-red' : 'bg-wab-yellow text-wab-black'}`}>
                  {proof.status}
                </div>
              </div>
              <div className="p-4 flex flex-col">
                <span className="font-mono text-xs uppercase opacity-70 mb-1">
                  {format(proof.dailyEntry.date, "MMM dd, yyyy")} • {proof.user.name}
                </span>
                <span className="font-sans text-lg font-bold mb-2">{proof.workoutType}</span>
                {proof.notes && (
                  <p className="font-sans text-sm opacity-80 border-l-2 border-wab-yellow pl-3 italic">
                    &quot;{proof.notes}&quot;
                  </p>
                )}
              </div>
            </div>
          ))}

          {proofs.length === 0 && (
            <div className="col-span-full py-12 text-center font-mono text-sm uppercase opacity-50">
              No entries recorded yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
