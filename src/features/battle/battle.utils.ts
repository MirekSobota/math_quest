import type { Enemy } from "../../types/game";
import { starterEnemies, bossEnemies } from "../../data/enemies";
import {
  getEnemyBaseHp,
  getRequiredHitsForEnemy,
  isBossEnemyInStage,
} from "./stage.utils";

function getBossEnemy(stage: number) {
  return bossEnemies[Math.floor((stage - 1) / 5) % bossEnemies.length];
}

function getNormalEnemy(stage: number, stageEnemyIndex: number) {
  const index = ((stage - 1) * 3 + (stageEnemyIndex - 1)) % starterEnemies.length;
  return starterEnemies[index];
}

export function getEnemyForStageSlot(
  stage: number,
  stageEnemyIndex: number,
  stageEnemyCount: number,
): Enemy {
  const isBoss = isBossEnemyInStage(stage, stageEnemyIndex, stageEnemyCount);
  const sourceEnemy = isBoss
    ? getBossEnemy(stage)
    : getNormalEnemy(stage, stageEnemyIndex);
  const maxHp = getEnemyBaseHp(stage, isBoss);

  return {
    ...sourceEnemy,
    hp: maxHp,
    maxHp,
    isBoss,
    requiredCorrectAnswers: getRequiredHitsForEnemy(isBoss),
    xpReward: isBoss ? 28 + stage * 3 : 10 + stage * 2,
  };
}
