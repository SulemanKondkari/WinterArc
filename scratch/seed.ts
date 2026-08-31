import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding dummy data for visualization...");

  // 1. Get or create a user for the partner
  let partnerUser = await prisma.user.findFirst({ where: { email: "partner@example.com" }});
  if (!partnerUser) {
    partnerUser = await prisma.user.create({
      data: {
        name: "Gym Bro",
        email: "partner@example.com",
      }
    });
  }

  // 2. Find current user
  const me = await prisma.user.findFirst();
  if (!me) {
    console.log("No current user found. Please login first.");
    return;
  }

  // 3. Create or find challenge
  let challenge = await prisma.challenge.findFirst();
  if (!challenge) {
    challenge = await prisma.challenge.create({
      data: {
        inviteCode: "SEED12",
        status: "ACTIVE",
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      }
    });
  } else {
    await prisma.challenge.update({ where: { id: challenge.id }, data: { status: "ACTIVE" }});
  }

  // 4. Ensure both are members
  for (const uid of [me.id, partnerUser.id]) {
    const mem = await prisma.challengeMember.findUnique({
      where: { userId_challengeId: { userId: uid, challengeId: challenge.id } }
    });
    if (!mem) {
      await prisma.challengeMember.create({
        data: { userId: uid, challengeId: challenge.id, lives: 3 }
      });
    }
  }

  // 5. Create media asset
  const media = await prisma.mediaAsset.create({
    data: {
      ownerId: partnerUser.id,
      challengeId: challenge.id,
      storageKey: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
      mimeType: "image/jpeg",
      sizeBytes: 1000,
    }
  });

  // 6. Create a pending proof from partner so PartnerReview shows up
  const daily = await prisma.dailyEntry.create({
    data: {
      userId: partnerUser.id,
      challengeId: challenge.id,
      date: new Date(),
      status: "AWAITING_PARTNER_REVIEW"
    }
  });

  await prisma.proofSubmission.create({
    data: {
      userId: partnerUser.id,
      challengeId: challenge.id,
      dailyEntryId: daily.id,
      mediaAssetId: media.id,
      workoutType: "Weightlifting",
      notes: "Hit a new PR on bench!",
      status: "AWAITING_PARTNER_REVIEW"
    }
  });

  // 7. Create approved proofs for me so TransformationModule shows up
  const myMedia1 = await prisma.mediaAsset.create({
    data: {
      ownerId: me.id,
      challengeId: challenge.id,
      storageKey: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop",
      mimeType: "image/jpeg",
      sizeBytes: 1000,
    }
  });

  const myMedia2 = await prisma.mediaAsset.create({
    data: {
      ownerId: me.id,
      challengeId: challenge.id,
      storageKey: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop",
      mimeType: "image/jpeg",
      sizeBytes: 1000,
    }
  });

  const myDaily1 = await prisma.dailyEntry.create({
    data: { userId: me.id, challengeId: challenge.id, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: "WORKOUT_APPROVED" }
  });

  await prisma.proofSubmission.create({
    data: {
      userId: me.id,
      challengeId: challenge.id,
      dailyEntryId: myDaily1.id,
      mediaAssetId: myMedia1.id,
      workoutType: "Cardio",
      status: "APPROVED"
    }
  });

  const myDaily2 = await prisma.dailyEntry.create({
    data: { userId: me.id, challengeId: challenge.id, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: "WORKOUT_APPROVED" }
  });

  await prisma.proofSubmission.create({
    data: {
      userId: me.id,
      challengeId: challenge.id,
      dailyEntryId: myDaily2.id,
      mediaAssetId: myMedia2.id,
      workoutType: "Weights",
      status: "APPROVED"
    }
  });

  console.log("Seeding complete! You should now see the Partner Review and Transformation Module on your dashboard.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
