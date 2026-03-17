import { uiIcons } from "../../data/uiAssets";
import { GameIcon } from "../ui/GameIcon";

type Props = {
  stage: number;
  stageEnemyIndex: number;
  stageEnemyCount: number;
  enemyHp: number;
  enemyMaxHp: number;
  playerHp: number;
  playerMaxHp: number;
  shieldCharges: number;
  hintCharges: number;
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

export function ProgressHud({
  stage,
  stageEnemyIndex,
  stageEnemyCount,
  enemyHp,
  enemyMaxHp,
  playerHp,
  playerMaxHp,
  shieldCharges,
  hintCharges,
}: Props) {
  const percent = getStageProgress(stageEnemyIndex, stageEnemyCount, enemyHp, enemyMaxHp);

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
            <div>Keep going</div>
          </div>
        </div>

        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:min-w-[214px]">
        <div className="rounded-2xl bg-slate-950/60 px-3 py-2.5 text-center md:px-4 md:py-3">
          <div className="flex items-center justify-center gap-1">
            <GameIcon src={uiIcons.heart} alt="Heart" size="sm" />
            <span className="text-sm font-black">
              {playerHp}/{playerMaxHp}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-950/60 px-3 py-2.5 text-center md:px-4 md:py-3">
          <div className="flex items-center justify-center gap-1">
            <span className="text-base">🛡️</span>
            <span className="text-sm font-black">{shieldCharges}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-950/60 px-3 py-2.5 text-center md:px-4 md:py-3">
          <div className="flex items-center justify-center gap-1">
            <GameIcon src={uiIcons.hint} alt="Hint" size="sm" />
            <span className="text-sm font-black">{hintCharges}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
