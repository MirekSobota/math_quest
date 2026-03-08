import { upgradesPool } from '../../data/upgrades';
import type { Upgrade } from '../../types/game';

function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export function getRewardOptions(): Upgrade[] {
  return shuffleArray(upgradesPool).slice(0, 2);
}