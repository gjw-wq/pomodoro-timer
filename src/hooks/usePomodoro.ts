import { useCallback, useEffect, useRef, useState } from "react";
import type {
  NotificationPermissionState,
  Settings,
  Stats,
  TimerMode,
} from "../types";
import { BASE_TITLE, MODE_META } from "../types";
import { ensureAudioContext, playChime } from "../utils/audio";
import { formatTime } from "../utils/format";
import { requestNotificationPermission, sendNotification } from "../utils/notify";
import { addCompletedPomodoro, loadSettings, loadStats, saveSettings } from "../utils/storage";

function durationSeconds(mode: TimerMode, settings: Settings): number {
  if (mode === "work") {
    return settings.workMinutes * 60;
  }
  if (mode === "shortBreak") {
    return settings.shortBreakMinutes * 60;
  }
  return settings.longBreakMinutes * 60;
}

/**
 * 番茄钟核心状态机。
 * 倒计时基于 endAt 时间戳计算，页面切后台也不产生累计误差。
 */
export function usePomodoro() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [mode, setMode] = useState<TimerMode>("work");
  const [totalSeconds, setTotalSeconds] = useState<number>(() =>
    durationSeconds("work", settings)
  );
  const [remaining, setRemaining] = useState<number>(totalSeconds);
  const [running, setRunning] = useState(false);
  const [completedInCycle, setCompletedInCycle] = useState(0);
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [message, setMessage] = useState("");
  const [notificationState, setNotificationState] =
    useState<NotificationPermissionState>(() => {
      if (typeof window === "undefined" || !("Notification" in window)) {
        return "unsupported";
      }
      return Notification.permission;
    });

  const endAtRef = useRef<number | null>(null);

  /** 当前阶段结束：提示 + 记录 + 自动切换到下一阶段 */
  const completePhase = useCallback(() => {
    playChime();
    let nextMode: TimerMode;
    if (mode === "work") {
      const newStats = addCompletedPomodoro();
      setStats(newStats);
      const newCount = completedInCycle + 1;
      if (newCount >= settings.longBreakInterval) {
        nextMode = "longBreak";
        setCompletedInCycle(0);
        setMessage(
          `连续完成 ${newCount} 个番茄，进入 ${settings.longBreakMinutes} 分钟长休息！`
        );
        sendNotification(
          BASE_TITLE,
          `连续完成 ${newCount} 个番茄，好好放松 ${settings.longBreakMinutes} 分钟吧！`
        );
      } else {
        nextMode = "shortBreak";
        setCompletedInCycle(newCount);
        setMessage(`工作完成，进入 ${settings.shortBreakMinutes} 分钟短休息！`);
        sendNotification(BASE_TITLE, "时间到了，该休息了！");
      }
    } else {
      nextMode = "work";
      setMessage("休息结束，开始新一轮专注吧！");
      sendNotification(BASE_TITLE, "休息结束，开始新一轮专注吧！");
    }
    const duration = durationSeconds(nextMode, settings);
    setMode(nextMode);
    setTotalSeconds(duration);
    setRemaining(duration);
    endAtRef.current = Date.now() + duration * 1000;
  }, [mode, settings, completedInCycle]);

  // 倒计时轮询：与真实时间对齐
  useEffect(() => {
    if (!running) {
      return;
    }
    const tick = () => {
      const endAt = endAtRef.current;
      if (endAt === null) {
        return;
      }
      const left = Math.ceil((endAt - Date.now()) / 1000);
      if (left <= 0) {
        completePhase();
        return;
      }
      setRemaining((prev) => (prev === left ? prev : left));
    };
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [running, completePhase]);

  // 计时中更新标签页标题
  useEffect(() => {
    document.title = running
      ? `${formatTime(remaining)} · ${MODE_META[mode].label} - ${BASE_TITLE}`
      : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [running, remaining, mode]);

  // 切换提示 8 秒后自动消失
  useEffect(() => {
    if (!message) {
      return;
    }
    const id = window.setTimeout(() => setMessage(""), 8000);
    return () => window.clearTimeout(id);
  }, [message]);

  const start = useCallback(() => {
    ensureAudioContext();
    void requestNotificationPermission().then((result) => {
      if (result !== null) {
        setNotificationState(result);
      }
    });
    if (endAtRef.current === null) {
      endAtRef.current = Date.now() + remaining * 1000;
    }
    setRunning(true);
  }, [remaining]);

  const pause = useCallback(() => {
    const endAt = endAtRef.current;
    if (endAt !== null) {
      setRemaining(Math.max(0, Math.ceil((endAt - Date.now()) / 1000)));
    }
    endAtRef.current = null;
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    endAtRef.current = null;
    setRunning(false);
    setRemaining(totalSeconds);
    setMessage("");
  }, [totalSeconds]);

  const switchMode = useCallback(
    (next: TimerMode) => {
      endAtRef.current = null;
      setRunning(false);
      const duration = durationSeconds(next, settings);
      setMode(next);
      setTotalSeconds(duration);
      setRemaining(duration);
      setMessage("");
    },
    [settings]
  );

  const updateSettings = useCallback(
    (next: Settings) => {
      setSettings(next);
      saveSettings(next);
      // 空闲时立即应用；计时中则下一阶段生效
      if (!running) {
        const duration = durationSeconds(mode, next);
        setTotalSeconds(duration);
        setRemaining(duration);
      }
    },
    [mode, running]
  );

  return {
    mode,
    modeLabel: MODE_META[mode].label,
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
  };
}
