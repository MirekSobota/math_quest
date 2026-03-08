export function getRequiredXpForLevel(level: number): number {
  return Math.floor(30 + level * level * 12);
}

export function applyXpGain(
  currentLevel: number,
  currentXp: number,
  gainedXp: number,
) {
  let level = currentLevel;
  let xp = currentXp + gainedXp;

  while (xp >= getRequiredXpForLevel(level)) {
    xp -= getRequiredXpForLevel(level);
    level += 1;
  }

  return { level, xp };
}

export function getXpProgressPercent(level: number, xp: number) {
  const required = getRequiredXpForLevel(level);
  return Math.min(100, (xp / required) * 100);
}
