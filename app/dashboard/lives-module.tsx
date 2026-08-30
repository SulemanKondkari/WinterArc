export function LivesModule({ lives }: { lives: number }) {
  return (
    <div className="font-display text-5xl tracking-tighter leading-none mt-2 flex gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className={i < lives ? "text-wab-red" : "text-wab-black/20"}>
          {i < lives ? "♥" : "○"}
        </span>
      ))}
    </div>
  );
}
