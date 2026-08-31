import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (secret !== "winterarc123") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete in correct order to respect foreign keys
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

    return NextResponse.json({ success: true, message: "Database completely purged." });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
