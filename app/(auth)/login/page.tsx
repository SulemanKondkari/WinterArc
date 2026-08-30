import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-wab-offwhite">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md border border-wab-black bg-white">
          <div className="p-8 border-b border-wab-black bg-wab-black text-wab-offwhite">
            <h1 className="font-display text-5xl uppercase tracking-tighter leading-none mb-2">
              Welcome<br />Back.
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest opacity-80">
              Winter Arc Buddy / Authentication
            </p>
          </div>
          
          <div className="p-8">
            <LoginForm />
          </div>

          <div className="p-4 border-t border-wab-black flex justify-between font-mono text-xs uppercase">
            <Link href="/forgot-password" className="hover:underline">Forgot Password</Link>
            <Link href="/signup" className="hover:underline text-wab-red">Create Account →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
