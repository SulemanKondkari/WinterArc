import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col min-h-screen font-sans bg-wab-offwhite overflow-hidden">
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between p-4 border-b border-wab-black">
        <div className="font-display text-2xl font-bold tracking-tighter">WAB.</div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="font-mono text-sm font-bold uppercase tracking-widest hover:bg-wab-black hover:text-wab-offwhite px-4 py-2 border border-transparent transition-colors">
            Login
          </Link>
          <Link href="/signup" className="font-mono text-sm font-bold uppercase tracking-widest bg-wab-black text-wab-offwhite px-4 py-2 hover:bg-wab-red transition-colors">
            Start Your Arc →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row flex-1 border-b border-wab-black">
        {/* Left Column (65%) */}
        <div className="md:w-[65%] flex flex-col justify-center p-8 md:p-16 lg:p-24 border-r-0 md:border-r border-wab-black relative group">
          <div className="absolute inset-0 bg-wab-yellow/0 transition-colors duration-500 group-hover:bg-wab-yellow/10" />
          <h1 className="font-display font-bold leading-[0.85] tracking-tighter text-[12vw] md:text-[10vw] uppercase z-10 relative">
            Winter<br />
            Arc<br />
            Buddy.
          </h1>
          <p className="mt-8 font-mono font-bold uppercase tracking-widest text-lg md:text-2xl z-10 relative">
            Two Friends.<br />
            One Challenge.<br />
            <span className="text-wab-red">No Excuses.</span>
          </p>
        </div>

        {/* Right Column (35%) */}
        <div className="md:w-[35%] flex flex-col bg-wab-black text-wab-offwhite">
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center border-b border-wab-offwhite/20">
            <div className="font-mono text-sm opacity-60 mb-2">/ 01 / DURATION</div>
            <div className="font-display text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-none">
              90<span className="text-3xl lg:text-5xl tracking-normal">DAYS</span>
            </div>
          </div>
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center border-b border-wab-offwhite/20">
            <div className="font-mono text-sm opacity-60 mb-2">/ 02 / PLAYERS</div>
            <div className="font-display text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-none">
              02
            </div>
          </div>
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center text-wab-red">
            <div className="font-mono text-sm opacity-80 text-wab-offwhite mb-2">/ 03 / STARTING LIVES</div>
            <div className="font-display text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-none">
              03
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-wab-black">
        <Link href="/signup" className="group flex flex-col items-center justify-center p-12 md:p-24 border-b md:border-b-0 md:border-r border-wab-black hover:bg-wab-red hover:text-wab-offwhite transition-colors">
          <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tighter mb-4 text-center">Start Your Arc <span className="inline-block group-hover:translate-x-2 transition-transform">→</span></h2>
          <span className="font-mono text-sm uppercase">Create a new challenge</span>
        </Link>
        <Link href="/join" className="group flex flex-col items-center justify-center p-12 md:p-24 hover:bg-wab-yellow transition-colors">
          <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tighter mb-4 text-center">Join With Code <span className="inline-block group-hover:translate-x-2 transition-transform">→</span></h2>
          <span className="font-mono text-sm uppercase">Accept a friend&apos;s invite</span>
        </Link>
      </section>

      {/* How it works Footer-ish */}
      <section className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-wab-black border-b border-wab-black">
        <div className="p-6 font-mono text-sm font-bold uppercase flex justify-between">
          <span>01 / Show Up</span>
          <span>✓</span>
        </div>
        <div className="p-6 font-mono text-sm font-bold uppercase flex justify-between">
          <span>02 / Prove It</span>
          <span>✓</span>
        </div>
        <div className="p-6 font-mono text-sm font-bold uppercase flex justify-between">
          <span>03 / Get Approved</span>
          <span>✓</span>
        </div>
        <div className="p-6 font-mono text-sm font-bold uppercase flex justify-between text-wab-red">
          <span>04 / Don&apos;t Lose</span>
          <span>♥</span>
        </div>
      </section>
    </main>
  );
}
