'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-wab-offwhite p-4">
      <div className="w-full max-w-md border-2 border-wab-black p-8 bg-white">
        <h2 className="font-display text-4xl uppercase tracking-tighter text-wab-red mb-4">
          SYSTEM FAILURE
        </h2>
        
        <p className="font-mono text-sm mb-6 text-neutral-600">
          A critical error occurred while processing your request. 
          {error.message ? ` Reason: ${error.message}` : ''}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-wab-black text-wab-offwhite font-display text-2xl uppercase tracking-widest p-4 text-center hover:bg-wab-red transition-colors"
          >
            Retry
          </button>
          
          <Link
            href="/dashboard"
            className="w-full border-2 border-wab-black text-wab-black font-display text-xl uppercase tracking-widest p-3 text-center hover:bg-wab-offwhite transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
