import { useState } from "react";
import Controls from "./components/Controls";
import ModeTabs from "./components/ModeTabs";
import SettingsPanel from "./components/SettingsPanel";
import StatsPanel from "./components/StatsPanel";
import TimerRing from "./components/TimerRing";
import { usePomodoro } from "./hooks/usePomodoro";
import { MODE_META } from "./types";
import { getThisWeekCount, getTodayCount } from "./utils/storage";

export default function App() {
  const {
    mode,
    remaining,
    totalSeconds,
    running,
    settings,
    stats,
    completedInCycle,
    message,
    notificationState,
    start,
    pause,
    reset,
    switchMode,
    updateSettings,
  } = usePomodoro();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const meta = MODE_META[mode];

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10 sm:py-14">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          🍅 专注番茄钟
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          工作 25 分钟 · 短休息 5 分钟 · 每 4 个番茄一次长休息
        </p>
      </header>

      {message && (
        <div
          role="status"
          className="mt-6 w-full max-w-md rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-center text-sm text-white"
        >
          {message}
        </div>
      )}

      {notificationState === "denied" && (
        <p className="mt-4 max-w-md rounded-lg bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-300">
          通知权限已被拒绝：计时结束时将只播放提示音。如需系统通知，请在浏览器地址栏左侧的站点设置中重新允许通知。
        </p>
      )}
      {notificationState === "unsupported" && (
        <p className="mt-4 max-w-md rounded-lg bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-300">
          当前浏览器不支持系统通知：计时结束时将只播放提示音。
        </p>
      )}

      <main className="mt-8 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur sm:p-8">
        <ModeTabs mode={mode} onSelect={switchMode} />
        <TimerRing remaining={remaining} totalSeconds={totalSeconds} mode={mode} />
        <Controls
          running={running}
          onToggle={running ? pause : start}
          onReset={reset}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <StatsPanel
          todayCount={getTodayCount(stats)}
          weekCount={getThisWeekCount(stats)}
          completedInCycle={completedInCycle}
          longBreakInterval={settings.longBreakInterval}
          activeDot={meta.dot}
        />
      </main>

      <footer className="mt-8 text-xs text-slate-500">
        数据仅保存在本地浏览器（LocalStorage），不会上传任何服务器
      </footer>

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onSave={updateSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
