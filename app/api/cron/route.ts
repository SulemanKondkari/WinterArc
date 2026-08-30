import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { startOfDay, subDays } from 'date-fns';

export async function GET(request: Request) {
  // 1. Verify Vercel Cron Secret (or local dev secret)
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // We are checking for YESTERDAY's proofs, assuming this runs at 00:01 AM
    const yesterday = startOfDay(subDays(new Date(), 1));

    const activeChallenges = await prisma.challenge.findMany({
      where: { status: 'ACTIVE' },
      include: { members: true },
    });

    let processed = 0;
    let deducted = 0;

    for (const challenge of activeChallenges) {
      for (const member of challenge.members) {
        processed++;
        
        // Did they have a successful entry yesterday?
        const entry = await prisma.dailyEntry.findFirst({
          where: {
            userId: member.userId,
            challengeId: challenge.id,
            date: yesterday,
            status: { in: ['WORKOUT_APPROVED', 'REST'] }
          }
        });

        if (!entry) {
          // They missed it! Deduct a life.
          if (member.lives > 0) {
            await prisma.$transaction(async (tx) => {
              // 1. Create a MISSED entry so we don't double penalize
              await tx.dailyEntry.create({
                data: {
                  userId: member.userId,
                  challengeId: challenge.id,
                  date: yesterday,
                  status: 'MISSED'
                }
              });

              // 2. Deduct life
              await tx.challengeMember.update({
                where: { id: member.id },
                data: { lives: member.lives - 1, streak: 0 }
              });

              // 3. Record LifeEvent
              await tx.lifeEvent.create({
                data: {
                  userId: member.userId,
                  challengeId: challenge.id,
                  previousBalance: member.lives,
                  amount: -1,
                  newBalance: member.lives - 1,
                  reason: 'Missed daily proof',
                  source: 'SYSTEM'
                }
              });

              // 4. Check for Game Over
              if (member.lives - 1 === 0) {
                await tx.challenge.update({
                  where: { id: challenge.id },
                  data: { status: 'COMPLETED' }
                });
                
                await tx.challengeMember.update({
                  where: { id: member.id },
                  data: { status: 'DISQUALIFIED' }
                });
              }
            });
            deducted++;
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      processedMembers: processed,
      livesDeducted: deducted,
      dateChecked: yesterday
    });

  } catch (error) {
    console.error("CRON ERROR:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
