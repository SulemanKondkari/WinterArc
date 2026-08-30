"use client";

import { useState } from "react";
import { reviewProofAction } from "@/app/actions/review";
import Image from "next/image";

type ProofType = { id: string; user: { name: string | null }; workoutType: string | null; notes: string | null; mediaAsset: { storageKey: string } | null };

export function PartnerReview({ proof }: { proof: ProofType }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReview = async (decision: "APPROVED" | "REJECTED") => {
    setIsSubmitting(true);
    await reviewProofAction(proof.id, decision, decision === "REJECTED" ? "Insufficient proof." : undefined);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full border-t border-wab-black bg-wab-yellow flex flex-col md:flex-row">
      <div className="p-8 border-b md:border-b-0 md:border-r border-wab-black md:w-1/3 flex flex-col justify-center bg-wab-black text-wab-offwhite">
        <h3 className="font-display text-4xl uppercase tracking-tighter leading-none mb-2 text-wab-yellow">
          Review<br />Required
        </h3>
        <p className="font-mono text-xs uppercase opacity-80 mb-4">
          {proof.user.name} submitted proof for today.
        </p>
        <div className="font-sans text-sm mb-2"><span className="font-bold">Type:</span> {proof.workoutType}</div>
        <div className="font-sans text-sm"><span className="font-bold">Notes:</span> {proof.notes || "None"}</div>
      </div>
      
      <div className="md:w-2/3 flex flex-col md:flex-row">
        <div className="flex-1 relative min-h-[300px] border-b md:border-b-0 md:border-r border-wab-black bg-neutral-900">
          {proof.mediaAsset && (
            <Image 
              src={proof.mediaAsset.storageKey} 
              alt="Proof" 
              fill
              className="object-contain"
            />
          )}
        </div>
        <div className="flex flex-row md:flex-col min-w-[150px]">
          <button 
            onClick={() => handleReview("APPROVED")}
            disabled={isSubmitting}
            className="flex-1 p-6 md:p-8 bg-wab-offwhite hover:bg-white text-wab-black flex items-center justify-center border-r md:border-r-0 md:border-b border-wab-black font-display text-2xl uppercase tracking-widest transition-colors"
          >
            Pass
          </button>
          <button 
            onClick={() => handleReview("REJECTED")}
            disabled={isSubmitting}
            className="flex-1 p-6 md:p-8 bg-wab-red text-wab-offwhite hover:bg-wab-black flex items-center justify-center font-display text-2xl uppercase tracking-widest transition-colors"
          >
            Fail
          </button>
        </div>
      </div>
    </div>
  );
}
