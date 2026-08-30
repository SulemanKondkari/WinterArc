"use client";

import { useState } from "react";
import { reviewProofAction } from "@/app/actions/review";
import Image from "next/image";

type ProofType = { id: string; user: { name: string | null }; workoutType: string | null; notes: string | null; mediaAsset: { storageKey: string } | null };

export function PartnerReview({ proof }: { proof: ProofType }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReview = async (decision: "APPROVED" | "REJECTED" | "REST") => {
    setIsSubmitting(true);
    let reason = undefined;
    if (decision === "REJECTED") reason = "Insufficient proof.";
    if (decision === "REST") reason = "Partner marked as rest day.";
    await reviewProofAction(proof.id, decision, reason);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full border-t border-wab-black bg-wab-yellow flex flex-col md:flex-row shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 relative mb-4">
      <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-wab-black md:w-1/3 flex flex-col justify-center bg-wab-black text-wab-offwhite">
        <h3 className="font-display text-4xl md:text-5xl uppercase tracking-tighter leading-none mb-2 text-wab-yellow">
          Review<br />Required
        </h3>
        <p className="font-mono text-sm uppercase opacity-90 mb-4">
          <strong className="text-white">{proof.user.name}</strong> submitted proof for today.
        </p>
        <div className="font-sans text-sm mb-2"><span className="font-bold text-wab-yellow">TYPE:</span> {proof.workoutType}</div>
        <div className="font-sans text-sm"><span className="font-bold text-wab-yellow">NOTES:</span> {proof.notes || "None"}</div>
      </div>
      
      <div className="md:w-2/3 flex flex-col">
        {/* Photo Area */}
        <div className="w-full relative min-h-[300px] md:min-h-[400px] border-b border-wab-black bg-neutral-900">
          {proof.mediaAsset && (
            <Image 
              src={proof.mediaAsset.storageKey} 
              alt="Proof" 
              fill
              className="object-contain"
            />
          )}
        </div>
        
        {/* Action Buttons (Mobile Optimized: Stack on mobile, Row on desktop) */}
        <div className="flex flex-col sm:flex-row w-full">
          <button 
            onClick={() => handleReview("APPROVED")}
            disabled={isSubmitting}
            className="flex-1 p-6 bg-white hover:bg-wab-offwhite text-wab-black flex items-center justify-center border-b sm:border-b-0 sm:border-r border-wab-black font-display text-2xl md:text-3xl uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            Pass
          </button>
          
          <button 
            onClick={() => handleReview("REST")}
            disabled={isSubmitting}
            className="flex-1 p-6 bg-neutral-300 hover:bg-neutral-400 text-wab-black flex items-center justify-center border-b sm:border-b-0 sm:border-r border-wab-black font-display text-2xl md:text-3xl uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            Rest Day
          </button>

          <button 
            onClick={() => handleReview("REJECTED")}
            disabled={isSubmitting}
            className="flex-1 p-6 bg-wab-red text-wab-offwhite hover:bg-wab-black flex items-center justify-center font-display text-2xl md:text-3xl uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            Fail
          </button>
        </div>
      </div>
    </div>
  );
}
