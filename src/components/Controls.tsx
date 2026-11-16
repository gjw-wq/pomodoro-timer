interface ControlsProps {
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
}

export default function Controls({
  running,
  onToggle,
  onReset,
  onOpenSettings,
}: ControlsProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onToggle}
        className={`min-w-36 rounded-full px-8 py-3.5 text-lg font-semibold transition-all ${
          running
            ? "border border-white/25 bg-white/10 text-white hover:bg-white/20"
            : "bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-lg shadow-rose-500/25 hover:brightness-110"
        }`}
      >
        {running ? "暂停" : "开始"}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-white/40 hover:text-white"
      >
        重置
      </button>
      <button
        type="button"
        onClick={onOpenSettings}
        aria-label="打开设置面板"
        title="设置"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-colors hover:border-white/40 hover:text-white"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <circle cx="12" cy="12" r="3" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
