import { AnimatePresence, motion } from "framer-motion";
import type { Enemy } from "../../types/game";

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
  const remainingHits = Math.max(
    0,
    enemy.requiredCorrectAnswers - correctAnswersOnCurrentEnemy,
  );

  const hpPercent =
    (remainingHits / Math.max(1, enemy.requiredCorrectAnswers)) * 100;

  return (
    <div
      className={`rounded-3xl px-4 py-3 text-center shadow-lg ${
        enemy.isBoss
          ? "bg-gradient-to-b from-orange-400 to-rose-500"
          : "bg-gradient-to-b from-violet-500 to-fuchsia-600"
      }`}
    >
      <div className="text-xs text-white/80">
        {enemy.isBoss ? "Boss Enemy" : "Enemy"}
      </div>

      <div className="mt-1 min-h-[170px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={enemy.id}
            initial={{ opacity: 0, scale: 0.85, y: 14 }}
            animate={
              lastHit === "correct"
                ? { opacity: 1, scale: [1, 1.04, 1], y: 0 }
                : lastHit === "wrong"
                  ? { opacity: 1, x: [0, -4, 4, 0], y: 0 }
                  : { opacity: 1, scale: 1, y: 0 }
            }
            exit={{ opacity: 0, scale: 0.78, y: -12 }}
            transition={{ duration: 0.28 }}
            className="flex items-center justify-center"
          >
            <img
              src={enemy.emoji}
              alt={enemy.name}
              className="mx-auto max-h-[170px] w-auto object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-1 text-[30px] font-bold leading-tight">
        {enemy.name}
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/20">
        <motion.div
          className="h-full rounded-full bg-green-300"
          animate={{ width: `${hpPercent}%` }}
          transition={{ duration: 0.22 }}
        />
      </div>

      <div className="mt-1 text-xs text-white/80">
        Hits left: {remainingHits}/{enemy.requiredCorrectAnswers}
      </div>
    </div>
  );
}
