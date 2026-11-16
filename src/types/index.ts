export type TimerMode = "work" | "shortBreak" | "longBreak";

export interface Settings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
}

export type Stats = Record<string, number>;

export type NotificationPermissionState =
  | "granted"
  | "denied"
  | "default"
  | "unsupported";

export interface ModeMeta {
  label: string;
  /** 激活状态的模式标签样式（Tailwind 完整类名） */
  tab: string;
  /** 环形进度描边颜色 */
  stroke: string;
  /** 循环进度点颜色（Tailwind 完整类名） */
  dot: string;
}

export const MODE_META: Record<TimerMode, ModeMeta> = {
  work: {
    label: "专注工作",
    tab: "bg-rose-500 text-white",
    stroke: "#f43f5e",
    dot: "bg-rose-500",
  },
  shortBreak: {
    label: "短休息",
    tab: "bg-emerald-500 text-white",
    stroke: "#10b981",
    dot: "bg-emerald-500",
  },
  longBreak: {
    label: "长休息",
    tab: "bg-sky-500 text-white",
    stroke: "#0ea5e9",
    dot: "bg-sky-500",
  },
};

export const BASE_TITLE = "专注番茄钟";
