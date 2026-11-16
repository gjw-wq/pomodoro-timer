function pad2(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

/** 将秒数格式化为 MM:SS */
export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${pad2(minutes)}:${pad2(seconds)}`;
}

/** 本地日期格式化为 YYYY-MM-DD */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
}

/** 获取本周周一（周日语系下周日归入上周） */
export function getMondayOf(date: Date): Date {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);
  return monday;
}
