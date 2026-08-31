import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting data purge...");
  
  await prisma.proofReview.deleteMany();
  await prisma.proofSubmission.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.dailyEntry.deleteMany();
  await prisma.restDay.deleteMany();
  await prisma.lifeEvent.deleteMany();
  await prisma.challengeContract.deleteMany();
  await prisma.challengeMember.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database has been completely purged.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
