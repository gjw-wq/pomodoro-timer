interface StatsPanelProps {
  todayCount: number;
  weekCount: number;
  completedInCycle: number;
  longBreakInterval: number;
  activeDot: string;
}

export default function StatsPanel({
  todayCount,
  weekCount,
  completedInCycle,
  longBreakInterval,
  activeDot,
}: StatsPanelProps) {
  const dots = Array.from({ length: longBreakInterval });

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-black/30 px-4 py-3 text-center">
          <p className="text-xs text-slate-400">今日完成</p>
          <p className="mt-1 font-mono text-2xl font-bold text-white">
            {todayCount}
            <span className="ml-0.5 text-sm font-normal text-slate-400">个番茄</span>
          </p>
        </div>
        <div className="rounded-xl bg-black/30 px-4 py-3 text-center">
          <p className="text-xs text-slate-400">本周完成</p>
          <p className="mt-1 font-mono text-2xl font-bold text-white">
            {weekCount}
            <span className="ml-0.5 text-sm font-normal text-slate-400">个番茄</span>
          </p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400">本轮进度（每 {longBreakInterval} 个番茄一次长休息）</p>
        <ul className="mt-2 inline-flex list-none gap-2" aria-label="本轮已完成的番茄数">
          {dots.map((_, index) => (
            <li
              key={index}
              aria-hidden="true"
              className={`h-3 w-3 rounded-full transition-colors ${
                index < completedInCycle ? activeDot : "bg-white/15"
              }`}
            />
          ))}
        </ul>
        <p className="sr-only">
          本轮已完成 {Math.min(completedInCycle, longBreakInterval)} 个番茄，共 {longBreakInterval} 个
        </p>
      </div>
    </div>
  );
}
