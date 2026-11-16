import type { Settings, Stats } from "../types";
import { formatLocalDate, getMondayOf } from "./format";

const SETTINGS_KEY = "pomodoro-settings";
const STATS_KEY = "pomodoro-stats";

export const DEFAULT_SETTINGS: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
};

export const MINUTES_MIN = 1;
export const MINUTES_MAX = 120;
export const INTERVAL_MIN = 2;
export const INTERVAL_MAX = 8;

/** 把任意输入收敛为 [min, max] 内的整数 */
export function clampInt(
  value: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }
  const rounded = Math.round(value);
  return Math.min(max, Math.max(min, rounded));
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw === null) {
      return { ...DEFAULT_SETTINGS };
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { ...DEFAULT_SETTINGS };
    }
    const record = parsed as Record<string, unknown>;
    return {
      workMinutes: clampInt(record.workMinutes, MINUTES_MIN, MINUTES_MAX, DEFAULT_SETTINGS.workMinutes),
      shortBreakMinutes: clampInt(record.shortBreakMinutes, MINUTES_MIN, MINUTES_MAX, DEFAULT_SETTINGS.shortBreakMinutes),
      longBreakMinutes: clampInt(record.longBreakMinutes, MINUTES_MIN, MINUTES_MAX, DEFAULT_SETTINGS.longBreakMinutes),
      longBreakInterval: clampInt(record.longBreakInterval, INTERVAL_MIN, INTERVAL_MAX, DEFAULT_SETTINGS.longBreakInterval),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // 存储不可用（如隐私模式）时静默降级，仅影响持久化
  }
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw === null) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    const stats: Stats = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        stats[key] = Math.floor(value);
      }
    }
    return stats;
  } catch {
    return {};
  }
}

/** 记录一次完成的工作番茄并保存，返回最新统计 */
export function addCompletedPomodoro(): Stats {
  const stats = loadStats();
  const today = formatLocalDate(new Date());
  stats[today] = (stats[today] ?? 0) + 1;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // 存储不可用时仅返回内存数据
  }
  return stats;
}

export function getTodayCount(stats: Stats): number {
  return stats[formatLocalDate(new Date())] ?? 0;
}

export function getThisWeekCount(stats: Stats): number {
  const monday = getMondayOf(new Date());
  let total = 0;
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    total += stats[formatLocalDate(day)] ?? 0;
  }
  return total;
}
