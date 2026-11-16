import type { TimerMode } from "../types";
import { MODE_META } from "../types";

const MODES: TimerMode[] = ["work", "shortBreak", "longBreak"];

interface ModeTabsProps {
  mode: TimerMode;
  onSelect: (mode: TimerMode) => void;
}

export default function ModeTabs({ mode, onSelect }: ModeTabsProps) {
  return (
    <div
      className="grid grid-cols-3 gap-1.5 rounded-2xl bg-black/30 p-1.5"
      role="tablist"
      aria-label="计时模式"
    >
      {MODES.map((item) => {
        const meta = MODE_META[item];
        const active = item === mode;
        return (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(item)}
            className={`rounded-xl px-2 py-2.5 text-sm font-medium transition-colors ${
              active ? meta.tab : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
