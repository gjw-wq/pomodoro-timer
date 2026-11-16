let audioContext: AudioContext | null = null;

type AudioContextCtor = typeof AudioContext;

function getAudioContextClass(): AudioContextCtor | null {
  if (typeof window === "undefined") {
    return null;
  }
  const w = window as Window & { webkitAudioContext?: AudioContextCtor };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

/**
 * 创建或唤醒 AudioContext。
 * 必须在用户手势（如点击"开始"）中调用，否则浏览器会阻止自动播放。
 */
export function ensureAudioContext(): void {
  const Ctor = getAudioContextClass();
  if (Ctor === null) {
    return;
  }
  if (audioContext === null) {
    audioContext = new Ctor();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  startAt: number,
  duration: number
): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startAt);
  // 用指数包络避免爆音
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.4, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.05);
}

/** 播放三连短提示音（880 - 660 - 880 Hz），无需音频文件 */
export function playChime(): void {
  if (getAudioContextClass() === null) {
    return;
  }
  ensureAudioContext();
  if (audioContext === null) {
    return;
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  const now = audioContext.currentTime;
  playTone(audioContext, 880, now, 0.18);
  playTone(audioContext, 660, now + 0.22, 0.18);
  playTone(audioContext, 880, now + 0.44, 0.18);
}
