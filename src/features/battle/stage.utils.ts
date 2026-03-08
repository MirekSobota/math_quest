export function getStageEnemyCount(stage: number): number {
  return stage % 5 === 0 ? 4 : 3;
}

export function isBossEnemyInStage(
  stage: number,
  stageEnemyIndex: number,
  stageEnemyCount: number,
): boolean {
  return stage % 5 === 0 && stageEnemyIndex === stageEnemyCount;
}

export function getRequiredHitsForEnemy(isBoss: boolean): number {
  return isBoss ? 4 : 2;
}

export function getLessonQuestionCount(stage: number): number {
  const enemyCount = getStageEnemyCount(stage);
  let total = 0;

  for (let i = 1; i <= enemyCount; i += 1) {
    total += getRequiredHitsForEnemy(isBossEnemyInStage(stage, i, enemyCount));
  }

  return total;
}
