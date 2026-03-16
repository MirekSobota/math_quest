import type { SpellTier } from "../../types/game";
import { uiIcons } from "../../data/uiAssets";
import { GameIcon } from "../ui/GameIcon";

type Props = {
  stage: number;
  stageEnemyIndex: number;
  stageEnemyCount: number;
  enemyHp: number;
  enemyMaxHp: number;
  playerHp: number;
  playerDamage: number;
  streak: number;
  activeSpell: SpellTier;
};

function getStageProgress(
  stageEnemyIndex: number,
  stageEnemyCount: number,
  enemyHp: number,
  enemyMaxHp: number,
) {
  const defeatedEnemies = stageEnemyIndex - 1;
  const currentEnemyProgress = 1 - enemyHp / Math.max(1, enemyMaxHp);
  return Math.min(
    100,
    ((defeatedEnemies + currentEnemyProgress) / Math.max(1, stageEnemyCount)) * 100,
  );
}

function getSpellMeta(activeSpell: SpellTier) {
  if (activeSpell === "mega") return { icon: "🌟", bonus: 4 };
  if (activeSpell === "lightning") return { icon: "⚡", bonus: 2 };
  if (activeSpell === "fireball") return { icon: "🔥", bonus: 1 };
  return { icon: "✨", bonus: 0 };
}

export function ProgressHud({
  stage,
  stageEnemyIndex,
  stageEnemyCount,
  enemyHp,
  enemyMaxHp,
  playerHp,
  playerDamage,
  streak,
  activeSpell,
}: Props) {
  const percent = getStageProgress(stageEnemyIndex, stageEnemyCount, enemyHp, enemyMaxHp);
  const spell = getSpellMeta(activeSpell);

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="rounded-2xl bg-slate-950/60 px-3 py-2.5 md:px-4 md:py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="hud-copy text-[10px] uppercase tracking-[0.16em] text-white/62">Stage {stage}</div>
            <div className="text-lg font-black leading-none md:text-xl">
              {stageEnemyIndex}/{stageEnemyCount}
            </div>
          </div>

          <div className="hud-copy text-right text-[11px] text-white/75">
            <div className="flex items-center justify-end gap-1">
              <GameIcon src={uiIcons.heart} alt="Enemy HP" size="sm" />
              <span>
                {enemyHp}/{enemyMaxHp}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="hud-pill-row mt-2 grid grid-cols-3 gap-2 text-[11px] text-white/88">
          <span className="hud-pill flex items-center justify-center gap-1 rounded-xl bg-white/7 px-2.5 py-2 text-center font-bold">
            <GameIcon src={uiIcons.attack} alt="Attack" size="sm" />
            {playerDamage}
          </span>
          <span className="hud-pill rounded-xl bg-white/7 px-2.5 py-2 text-center font-bold">
            🔥 {streak}
          </span>
          <span className="hud-pill rounded-xl bg-white/7 px-2.5 py-2 text-center font-bold">
            {spell.icon} +{spell.bonus}
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-950/60 px-3 py-2.5 text-center sm:min-w-[102px] md:px-4 md:py-3">
        <div className="mt-0.5 flex flex-wrap items-center justify-center gap-1">
          {Array.from({ length: playerHp }, (_, i) => (
            <GameIcon key={i} src={uiIcons.heart} alt="Heart" size="sm" />
          ))}
        </div>
      </div>
    </div>
  );
}
