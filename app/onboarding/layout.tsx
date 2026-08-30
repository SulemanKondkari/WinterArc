import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: _authData } = await auth.getSession();
  const session = _authData ? { user: _authData.user } : null;
  if (!session?.user?.id) redirect("/login");

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-wab-offwhite">
      <nav className="w-full flex items-center justify-between p-4 border-b border-wab-black">
        <div className="font-display text-2xl font-bold tracking-tighter">WAB.</div>
        <div className="font-mono text-xs uppercase opacity-80 tracking-widest">
          Onboarding
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {children}
      </div>
    </main>
  );
}
