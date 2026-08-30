import Link from "next/link";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-wab-offwhite">
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        <div className="w-full max-w-md border border-wab-black bg-white">
          <div className="p-8 border-b border-wab-black bg-wab-black text-wab-offwhite">
            <h1 className="font-display text-5xl uppercase tracking-tighter leading-none mb-2">
              Create<br />Your<br />Arc.
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest opacity-80">
              Winter Arc Buddy / Registration
            </p>
          </div>
          
          <div className="p-8">
            <SignupForm />
          </div>

          <div className="p-4 border-t border-wab-black flex justify-between font-mono text-xs uppercase">
            <span>Already playing?</span>
            <Link href="/login" className="hover:underline text-wab-red">Login →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
