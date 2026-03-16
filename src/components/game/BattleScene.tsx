import { AnimatePresence, motion } from "framer-motion";
import type { Enemy } from "../../types/game";

function getProgressPercent(value: number, max: number) {
  return Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
}

type Props = {
  enemy: Enemy;
  lastHit: "correct" | "wrong" | null;
  correctAnswersOnCurrentEnemy: number;
};

export function BattleScene({
  enemy,
  lastHit,
  correctAnswersOnCurrentEnemy,
}: Props) {
  const hpPercent = getProgressPercent(enemy.hp, enemy.maxHp);
  const hitsPercent = getProgressPercent(
    Math.min(correctAnswersOnCurrentEnemy, enemy.requiredCorrectAnswers),
    enemy.requiredCorrectAnswers,
  );

  return (
    <div
      className={`battle-visual-card flex h-full min-h-0 flex-col rounded-3xl px-3 py-3 text-center shadow-lg md:px-4 md:py-4 ${
        enemy.isBoss
          ? "bg-gradient-to-b from-orange-400 to-rose-500"
          : "bg-gradient-to-b from-violet-500 to-fuchsia-600"
      }`}
    >
      <div className="flex items-center justify-between gap-3 text-xs font-black text-white/92 md:text-sm">
        <span className="rounded-full bg-white/14 px-3 py-1">{enemy.isBoss ? "👑 Boss" : "👾 Foe"}</span>
        <span className="rounded-full bg-white/14 px-3 py-1">⭐ {enemy.xpReward}</span>
      </div>

      <div className="mt-2 rounded-full bg-white/16 px-4 py-2 text-xl font-black leading-none shadow-[0_10px_24px_rgba(15,23,42,0.16)] md:text-3xl">
        {enemy.name}
      </div>

      <div className="mt-2 flex min-h-0 flex-1 items-center justify-center rounded-[28px] bg-white/8 px-3 py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={enemy.id}
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={
              lastHit === "correct"
                ? { opacity: 1, scale: [1, 1.05, 1], y: 0 }
                : lastHit === "wrong"
                  ? { opacity: 1, x: [0, -8, 8, -4, 4, 0], y: 0 }
                  : { opacity: 1, scale: 1, y: 0 }
            }
            exit={{ opacity: 0, scale: 0.78, y: -12 }}
            transition={{ duration: 0.28 }}
            className="flex h-full w-full items-center justify-center"
          >
            <img
              src={enemy.emoji}
              alt={enemy.name}
              className="battle-enemy-image mx-auto h-auto w-auto max-w-full object-contain drop-shadow-[0_18px_30px_rgba(15,23,42,0.28)]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-left text-[11px] font-black text-white/92 md:text-xs">
        <div className="rounded-2xl bg-white/10 px-3 py-2.5">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span>❤️ HP</span>
            <span>
              {enemy.hp}/{enemy.maxHp}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full rounded-full bg-emerald-300"
              animate={{ width: `${hpPercent}%` }}
              transition={{ duration: 0.22 }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 px-3 py-2.5">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span>✅ Hits</span>
            <span>
              {Math.min(correctAnswersOnCurrentEnemy, enemy.requiredCorrectAnswers)}/
              {enemy.requiredCorrectAnswers}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full rounded-full bg-amber-300"
              animate={{ width: `${hitsPercent}%` }}
              transition={{ duration: 0.22 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
