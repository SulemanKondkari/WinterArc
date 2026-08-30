export function CalendarModule({ challengeId }: { challengeId: string }) {
  // In a real implementation, we would fetch the last 7 days of DailyEntry
  // Mocking for layout purposes now
  const days = [
    { name: "MON", status: "✓", state: "done" },
    { name: "TUE", status: "✓", state: "done" },
    { name: "WED", status: "R", state: "rest" },
    { name: "THU", status: "✓", state: "done" },
    { name: "FRI", status: "!", state: "issue" },
    { name: "SAT", status: "—", state: "upcoming" },
    { name: "SUN", status: "—", state: "upcoming" },
  ];

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-wab-black font-mono text-sm font-bold uppercase tracking-widest bg-wab-offwhite">
        This Week
      </div>
      <div className="grid grid-cols-7 divide-x divide-wab-black">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center justify-center p-4 md:p-6 bg-white hover:bg-wab-offwhite transition-colors cursor-pointer">
            <span className="font-mono text-xs font-bold mb-2">{day.name}</span>
            <span className={`font-display text-3xl ${day.state === 'rest' ? 'text-wab-black' : day.state === 'issue' ? 'text-wab-red' : day.state === 'done' ? 'text-wab-black' : 'text-wab-black/30'}`}>
              {day.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
