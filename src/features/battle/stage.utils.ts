export function getStageEnemyCount(stage: number): number {
  return stage % 5 === 0 ? 1 : 3;
}

export function isBossEnemyInStage(
  stage: number,
  stageEnemyIndex: number,
  stageEnemyCount: number,
): boolean {
  return stage % 5 === 0 && stageEnemyIndex === stageEnemyCount;
}

export function getEnemyBaseHp(stage: number, isBoss: boolean) {
  if (isBoss) {
    return 8 + Math.floor((stage - 1) / 5);
  }

  return 2 + Math.floor((stage - 1) / 4);
}

export function getLessonQuestionCount(stage: number): number {
  const enemyCount = getStageEnemyCount(stage);
  let total = 0;

  for (let i = 1; i <= enemyCount; i += 1) {
    const isBoss = isBossEnemyInStage(stage, i, enemyCount);
    total += getEnemyBaseHp(stage, isBoss);
  }

  return total;
}
