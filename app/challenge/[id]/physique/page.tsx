import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

export default async function PhysiquePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: { members: true }
  });

  if (!challenge) redirect("/dashboard");
  
  const isMember = challenge.members.some(m => m.userId === session.user?.id);
  if (!isMember) redirect("/dashboard");

  const assets = await prisma.mediaAsset.findMany({
    where: { 
      challengeId: id, 
      ownerId: session.user.id,
      type: "PHYSIQUE"
    },
    orderBy: { createdAt: "asc" }
  });

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-wab-offwhite">
      <nav className="w-full flex items-center justify-between p-4 border-b border-wab-black">
        <Link href="/dashboard" className="font-display text-2xl font-bold tracking-tighter hover:text-wab-red">WAB.</Link>
        <div className="font-mono text-xs uppercase tracking-widest font-bold">
          Physique Timeline
        </div>
      </nav>

      <div className="flex-1 p-4 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-end border-b border-wab-black pb-4 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tighter leading-none">Your Progress</h1>
            <p className="font-mono text-sm uppercase opacity-70 mt-2">Private chronological timeline</p>
          </div>
          <Link href={`/challenge/${challenge.id}/physique/new`} className="bg-wab-black text-wab-offwhite font-mono text-sm uppercase font-bold px-6 py-3 hover:bg-wab-yellow hover:text-wab-black transition-colors">
            + New Checkpoint
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {assets.map((asset, index) => (
            <div key={asset.id} className="border border-wab-black bg-white flex flex-col">
              <div className="p-4 border-b border-wab-black flex justify-between items-center bg-wab-offwhite">
                <span className="font-display text-2xl tracking-tighter uppercase">Month {index + 1}</span>
                <span className="font-mono text-xs font-bold">{format(asset.createdAt, "MMM dd, yyyy")}</span>
              </div>
              <div className="relative aspect-[3/4] w-full bg-neutral-900">
                <Image 
                  src={asset.storageKey}
                  alt={`Physique Checkpoint ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}

          {assets.length === 0 && (
            <div className="col-span-full py-24 text-center font-mono text-sm uppercase opacity-50">
              No checkpoints recorded yet. Start your timeline.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
