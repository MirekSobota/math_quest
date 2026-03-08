type Props = {
  stage: number;
  lessonQuestionIndex: number;
  lessonQuestionCount: number;
  playerHp: number;
};

export function ProgressHud({
  stage,
  lessonQuestionIndex,
  lessonQuestionCount,
  playerHp,
}: Props) {
  const percent = Math.min(
    100,
    (lessonQuestionIndex / Math.max(1, lessonQuestionCount)) * 100,
  );

  return (
    <div className="grid grid-cols-[1fr_auto] gap-2">
      <div className="rounded-2xl bg-white/10 px-3 py-2">
        <div className="flex items-center justify-between text-[11px] text-white/75">
          <span>Stage {stage}</span>
          <span>
            {lessonQuestionIndex}/{lessonQuestionCount}
          </span>
        </div>

        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-violet-400 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white/10 px-3 py-2">
        <div className="text-[11px] text-white/70">HP</div>
        <div className="mt-0.5 text-lg font-bold leading-none">
          {"❤️".repeat(playerHp)}
        </div>
      </div>
    </div>
  );
}
