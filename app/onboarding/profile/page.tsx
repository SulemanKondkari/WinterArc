import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/login");

  return (
    <div className="w-full max-w-xl border border-wab-black bg-white">
      <div className="p-8 border-b border-wab-black bg-wab-black text-wab-offwhite">
        <h1 className="font-display text-4xl uppercase tracking-tighter leading-none mb-2">
          Step 01 /<br />Your Profile
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest opacity-80">
          Configure Your Identity
        </p>
      </div>
      
      <div className="p-8">
        <ProfileForm initialData={{ username: user.username || "", timezone: user.timezone || "UTC" }} />
      </div>
    </div>
  );
}
