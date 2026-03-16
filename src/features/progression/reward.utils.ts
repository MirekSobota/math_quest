import { rewardPool } from "../../data/rewards";
import type { Upgrade } from "../../types/game";

function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export function getRewardOptions(): Upgrade[] {
  const pool = shuffleArray(rewardPool);
  const pickedTypes = new Set<string>();
  const options: Upgrade[] = [];

  for (const reward of pool) {
    if (pickedTypes.has(reward.type)) continue;
    options.push(reward);
    pickedTypes.add(reward.type);
    if (options.length === 2) break;
  }

  return options.length === 2 ? options : pool.slice(0, 2);
}
