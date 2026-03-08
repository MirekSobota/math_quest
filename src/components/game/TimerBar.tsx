type Props = {
  value: number;
  max: number;
};

export function TimerBar({ value, max }: Props) {
  const safeMax = Math.max(1, max);
  const percent = Math.max(0, Math.min(100, (value / safeMax) * 100));

  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-white/70">
        <span>Time</span>
        <span>
          {value}/{max}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-amber-300 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
