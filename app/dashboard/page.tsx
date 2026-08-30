import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { differenceInDays, startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { LivesModule } from "./lives-module";
import { CalendarModule } from "./calendar-module";
import { PartnerReview } from "./partner-review";
import { TransformationModule } from "./transformation-module";

export default async function DashboardPage() {
  const { data: _authData } = await auth.getSession();
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) redirect("/login");

  const allMemberships = await prisma.challengeMember.findMany({
    where: { userId: session.user.id },
    include: { challenge: { include: { members: { include: { user: true } } } } }
  });

  const activeMembership = allMemberships.find(m => m.challenge.status === "ACTIVE" || m.challenge.status === "WAITING_FOR_PARTNER");

  if (!activeMembership) {
    redirect("/onboarding");
  }

  const { challenge } = activeMembership;
  
  if (challenge.status === "WAITING_FOR_PARTNER") {
    redirect(`/onboarding/invite/${challenge.id}`);
  }

  const partner = challenge.members.find(m => m.userId !== session.user?.id);
  const me = challenge.members.find(m => m.userId === session.user?.id)!;

  const TIMEZONE = "Asia/Kolkata";
  const nowIST = toZonedTime(new Date(), TIMEZONE);
  const todayIST = startOfDay(nowIST);

  let currentDay = 1;
  if (challenge.startDate) {
    const startIST = startOfDay(toZonedTime(challenge.startDate, TIMEZONE));
    currentDay = differenceInDays(todayIST, startIST) + 1;
  }

  // Check if I have already submitted today
  const myTodayEntry = await prisma.dailyEntry.findUnique({
    where: {
      userId_challengeId_date: {
        userId: session.user.id,
        challengeId: challenge.id,
        date: todayIST
      }
    }
  });

  const hasSubmittedToday = myTodayEntry && (
    myTodayEntry.status === "AWAITING_PARTNER_REVIEW" || 
    myTodayEntry.status === "WORKOUT_APPROVED" || 
    myTodayEntry.status === "REST"
  );

  // Get transformation photos
  const myApprovedProofs = await prisma.proofSubmission.findMany({
    where: { 
      userId: session.user.id, 
      challengeId: challenge.id, 
      status: "APPROVED" 
    },
    orderBy: { createdAt: 'asc' },
    include: { mediaAsset: true }
  });

  const firstProof = myApprovedProofs[0] || null;
  const latestProof = myApprovedProofs.length > 1 ? myApprovedProofs[myApprovedProofs.length - 1] : null;

  // Check for pending partner proofs
  const pendingPartnerProof = partner ? await prisma.proofSubmission.findFirst({
    where: {
      userId: partner.userId,
      challengeId: challenge.id,
      status: "AWAITING_PARTNER_REVIEW"
    },
    include: {
      user: true,
      mediaAsset: true
    }
  }) : null;

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-wab-offwhite">
      {/* Header */}
      <nav className="w-full flex items-center justify-between p-4 border-b border-wab-black">
        <div className="font-display text-2xl font-bold tracking-tighter">WAB.</div>
        <div className="font-mono text-sm font-bold uppercase tracking-widest flex items-center gap-4">
          <span>{session.user.name}</span>
          <Link href="/settings" className="hover:text-wab-red">Settings</Link>
        </div>
      </nav>

      {/* Main Grid Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-wab-black">
        
        {/* Partner Review Alert */}
        {pendingPartnerProof && (
          <div className="md:col-span-12">
            <PartnerReview proof={pendingPartnerProof} />
          </div>
        )}

        {/* Top Info Bar */}
        <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 border-b border-wab-black">
          <div className="p-6 border-r border-wab-black flex flex-col justify-center">
            <span className="font-mono text-xs uppercase opacity-70">Challenge</span>
            <span className="font-display text-4xl uppercase tracking-tighter leading-none mt-1">Winter Arc</span>
          </div>
          <div className="p-6 border-b md:border-b-0 border-r-0 md:border-r border-wab-black flex flex-col justify-center">
            <span className="font-mono text-xs uppercase opacity-70">Progress</span>
            <span className="font-display text-4xl uppercase tracking-tighter leading-none mt-1">DAY {currentDay.toString().padStart(3, '0')} <span className="opacity-50">/ {challenge.durationDays.toString().padStart(3, '0')}</span></span>
          </div>
          <div className="p-6 border-r border-wab-black flex flex-col justify-center bg-wab-black text-wab-offwhite">
            <span className="font-mono text-xs uppercase opacity-70">Streak</span>
            <span className="font-display text-4xl uppercase tracking-tighter leading-none mt-1">{me.streak.toString().padStart(2, '0')} <span className="opacity-50 text-xl tracking-normal">DAYS</span></span>
          </div>
          <div className="p-6 flex flex-col justify-center text-wab-red">
            <span className="font-mono text-xs uppercase opacity-70 text-wab-black">Lives Remaining</span>
            <LivesModule lives={me.lives} />
          </div>
        </div>

        {/* Action Row */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 border-b border-wab-black">
          {hasSubmittedToday ? (
            <div className="group p-12 md:p-16 flex flex-col justify-center items-center bg-wab-black text-wab-offwhite border-b md:border-b-0 md:border-r border-wab-black min-h-[250px]">
              <span className="font-mono text-sm uppercase font-bold mb-4 text-wab-yellow">Today&apos;s Mission Complete</span>
              <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tighter leading-none text-center">
                Great Work<br />Today!
              </h2>
            </div>
          ) : (
            <Link href={`/challenge/${challenge.id}/proof`} className="group p-12 md:p-16 flex flex-col justify-center items-center hover:bg-wab-yellow transition-colors border-b md:border-b-0 md:border-r border-wab-black min-h-[250px]">
              <span className="font-mono text-sm uppercase font-bold mb-4">Today&apos;s Mission</span>
              <h2 className="font-display text-6xl md:text-7xl uppercase tracking-tighter leading-none text-center">
                Take<br />Proof <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
              </h2>
            </Link>
          )}

          <div className="flex flex-col border-b md:border-b-0 md:border-r border-wab-black">
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center items-center min-h-[150px] bg-wab-offwhite border-b border-wab-black">
              <span className="font-mono text-sm uppercase font-bold mb-4 text-wab-black/70">Partner Status</span>
              <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter leading-none text-center">
                {partner?.user.name}
              </h2>
              <div className="mt-4 px-4 py-2 border-2 border-wab-black font-mono font-bold uppercase tracking-widest text-sm">
                Pending
              </div>
            </div>
            <Link href={`/challenge/${challenge.id}/journal`} className="group p-6 flex flex-col justify-center items-center hover:bg-wab-black hover:text-wab-offwhite transition-colors bg-white">
              <span className="font-display text-2xl uppercase tracking-widest text-center">
                View Journal <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Transformation Module */}
        <div className="md:col-span-12">
          <TransformationModule firstProof={firstProof} latestProof={latestProof} />
        </div>

        {/* Weekly Calendar */}
        <div className="md:col-span-12">
          <CalendarModule challengeId={challenge.id} />
        </div>
      </div>
    </main>
  );
}
