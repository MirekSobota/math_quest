export function getUpgradePrice(base: number, level: number) {
  return Math.floor(base * (1 + level * 0.6));
}

export function getUpgradeMax(type: string) {
  if (type === "hp") return 5;
  if (type === "damage") return 5;
  if (type === "hint") return 3;

  return 99;
}
