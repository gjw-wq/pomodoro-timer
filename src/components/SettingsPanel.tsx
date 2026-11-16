import { useState, type FormEvent } from "react";
import type { Settings } from "../types";
import {
  INTERVAL_MAX,
  INTERVAL_MIN,
  MAX_MINUTES,
  MINUTES_MIN,
  clampInt,
} from "../utils/storage";

interface SettingsPanelProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

interface Draft {
  workMinutes: string;
  shortBreakMinutes: string;
  longBreakMinutes: string;
  longBreakInterval: string;
}

function toDraft(settings: Settings): Draft {
  return {
    workMinutes: String(settings.workMinutes),
    shortBreakMinutes: String(settings.shortBreakMinutes),
    longBreakMinutes: String(settings.longBreakMinutes),
    longBreakInterval: String(settings.longBreakInterval),
  };
}

export default function SettingsPanel({
  settings,
  onSave,
  onClose,
}: SettingsPanelProps) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(settings));
  const [error, setError] = useState("");

  const update = (key: keyof Draft) => (value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const work = Number(draft.workMinutes);
    const short = Number(draft.shortBreakMinutes);
    const long = Number(draft.longBreakMinutes);
    const interval = Number(draft.longBreakInterval);
    if (![work, short, long, interval].every((n) => Number.isFinite(n))) {
      setError("请输入有效的数字");
      return;
    }
    onSave({
      workMinutes: clampInt(work, MINUTES_MIN, MINUTES_MAX, settings.workMinutes),
      shortBreakMinutes: clampInt(
        short,
        MINUTES_MIN,
        MAX_MINUTES,
        settings.shortBreakMinutes
      ),
      longBreakMinutes: clampInt(
        long,
        MINUTES_MIN,
        MAX_MINUTES,
        settings.longBreakMinutes
      ),
      longBreakInterval: clampInt(
        interval,
        INTERVAL_MIN,
        INTERVAL_MAX,
        settings.longBreakInterval
      ),
    });
    onClose();
  };

  const fieldClass =
    "mt-1.5 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-white outline-none transition-colors focus:border-rose-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="计时设置"
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">计时设置</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭设置面板"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-300">
            工作时长（分钟，{MINUTES_MIN}-{MAX_MINUTES}）
            <input
              type="number"
              inputMode="numeric"
              min={MINUTES_MIN}
              max={MAX_MINUTES}
              value={draft.workMinutes}
              onChange={(e) => update("workMinutes")(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm text-slate-300">
            短休息时长（分钟，{MINUTES_MIN}-{MAX_MINUTES}）
            <input
              type="number"
              inputMode="numeric"
              min={MINUTES_MIN}
              max={MAX_MINUTES}
              value={draft.shortBreakMinutes}
              onChange={(e) => update("shortBreakMinutes")(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm text-slate-300">
            长休息时长（分钟，{MINUTES_MIN}-{MAX_MINUTES}）
            <input
              type="number"
              inputMode="numeric"
              min={MINUTES_MIN}
              max={MAX_MINUTES}
              value={draft.longBreakMinutes}
              onChange={(e) => update("longBreakMinutes")(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm text-slate-300">
            几个番茄后长休息（{INTERVAL_MIN}-{INTERVAL_MAX}）
            <input
              type="number"
              inputMode="numeric"
              min={INTERVAL_MIN}
              max={INTERVAL_MAX}
              value={draft.longBreakInterval}
              onChange={(e) => update("longBreakInterval")(e.target.value)}
              className={fieldClass}
            />
          </label>

          {error && (
            <p className="text-sm text-rose-400" role="alert">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              保存
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-white/40 hover:text-white"
            >
              取消
            </button>
          </div>
          <p className="text-xs text-slate-500">
            计时中保存的设置会应用到下一个阶段；设置自动保存在本地浏览器。
          </p>
        </form>
      </div>
    </div>
  );
}
