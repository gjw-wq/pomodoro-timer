import type { TimerMode } from "../types";
import { MODE_META } from "../types";
import { formatTime } from "../utils/format";

const SIZE = 280;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const MODES: TimerMode[] = ["work", "shortBreak", "longBreak"];

interface TimerRingProps {
  remaining: number;
  totalSeconds: number;
  mode: TimerMode;
}

export default function TimerRing({
  remaining,
  totalSeconds,
  mode,
}: TimerRingProps) {
  const progress = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const offset = CIRCUMFERENCE * (1 - progress);
  const meta = MODE_META[mode];

  return (
    <div className="mt-8">
      <div className="relative mx-auto h-60 w-60 sm:h-72 sm:w-72">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full -rotate-90"
          role="img"
          aria-label={`${meta.label}剩余 ${formatTime(remaining)}`}
        >
          {/* 背景圆环 */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={STROKE_WIDTH}
          />
          {/* 进度圆环 */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={meta.stroke}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-300 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono text-5xl font-bold tabular-nums text-white sm:text-6xl"
            aria-hidden="true"
          >
            {formatTime(remaining)}
          </span>
          <span className="mt-2 text-sm font-medium text-slate-400">
            {meta.label}
          </span>
        </div>
      </div>
      {/* 供屏幕阅读器使用的文本（视觉隐藏） */}
      <p className="sr-only">{`${meta.label}剩余 ${formatTime(remaining)}`}</p>
      <div className="mt-2 text-center">
        <ul className="inline-flex list-none gap-1.5" aria-hidden="true">
          {MODES.map((item) => (
            <li
              key={item}
              className={`h-1.5 w-1.5 rounded-full ${
                item === mode ? MODE_META[item].dot : "bg-white/15"
              }`}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
