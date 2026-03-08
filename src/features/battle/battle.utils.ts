import type { Enemy } from "../../types/game";
import { starterEnemies, bossEnemies } from "../../data/enemies";
import { getRequiredHitsForEnemy, isBossEnemyInStage } from "./stage.utils";

export function getEnemyForStageSlot(
  stage: number,
  stageEnemyIndex: number,
  stageEnemyCount: number,
): Enemy {
  const isBoss = isBossEnemyInStage(stage, stageEnemyIndex, stageEnemyCount);

  if (isBoss) {
    const boss = bossEnemies[(Math.floor(stage / 5) - 1) % bossEnemies.length];
    const extraHp = Math.floor(stage / 4);

    return {
      ...boss,
      hp: boss.maxHp + extraHp * 3,
      maxHp: boss.maxHp + extraHp * 3,
      isBoss: true,
      requiredCorrectAnswers: getRequiredHitsForEnemy(true),
      xpReward: 30 + stage * 3,
    };
  }

  const biomeIndex = stage <= 5 ? 0 : stage <= 10 ? 4 : stage <= 15 ? 8 : 0;

  const pool = starterEnemies.slice(biomeIndex, biomeIndex + 4);
  const enemy = pool[(stageEnemyIndex - 1) % pool.length] ?? starterEnemies[0];
  const extraHp = Math.floor(stage / 3);

  return {
    ...enemy,
    hp: enemy.maxHp + extraHp,
    maxHp: enemy.maxHp + extraHp,
    isBoss: false,
    requiredCorrectAnswers: getRequiredHitsForEnemy(false),
    xpReward: 8 + stage,
  };
}
