import Image from "next/image";

type TransformationProof = {
  id: string;
  createdAt: Date;
  mediaAsset: {
    storageKey: string;
  };
} | null;

export function TransformationModule({ firstProof, latestProof }: { firstProof: TransformationProof, latestProof: TransformationProof }) {
  if (!firstProof) return null; // Wait until they have at least one approved proof

  return (
    <div className="w-full border-b border-wab-black bg-wab-offwhite flex flex-col">
      <div className="p-6 border-b border-wab-black flex items-center justify-between bg-wab-black text-wab-offwhite">
        <h3 className="font-display text-3xl uppercase tracking-tighter leading-none">Transformation</h3>
        <span className="font-mono text-xs uppercase opacity-70">Day 1 vs Latest</span>
      </div>
      
      <div className="flex flex-row h-[300px] md:h-[500px]">
        {/* Day 1 */}
        <div className="flex-1 relative border-r border-wab-black bg-neutral-900 group">
          <Image 
            src={firstProof.mediaAsset.storageKey} 
            alt="Day 1 Proof" 
            fill
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-wab-black text-wab-offwhite px-3 py-1 font-mono text-xs uppercase font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            Day 1
          </div>
        </div>
        
        {/* Latest */}
        <div className="flex-1 relative bg-neutral-900 group">
          {latestProof ? (
            <Image 
              src={latestProof.mediaAsset.storageKey} 
              alt="Latest Proof" 
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-wab-offwhite/50 p-6 text-center">
              <span className="font-mono text-sm uppercase tracking-widest mb-2">Awaiting Progress</span>
              <p className="font-sans text-xs max-w-[200px]">Keep submitting proofs to see your transformation here.</p>
            </div>
          )}
          {latestProof && (
            <div className="absolute bottom-4 right-4 bg-wab-yellow text-wab-black px-3 py-1 font-mono text-xs uppercase font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Latest
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
