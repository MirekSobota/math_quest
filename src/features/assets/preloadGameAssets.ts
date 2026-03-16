import forest from "../../assets/images/backgrounds/forest.png";
import cave from "../../assets/images/backgrounds/cave.png";
import ice from "../../assets/images/backgrounds/ice.png";
import lava from "../../assets/images/backgrounds/lava.png";
import castle from "../../assets/images/backgrounds/castle.png";

import { bossEnemies, starterEnemies } from "../../data/enemies";
import { uiIcons } from "../../data/uiAssets";

const backgroundUrls = [forest, cave, ice, lava, castle];
const enemyUrls = [...starterEnemies, ...bossEnemies].map((enemy) => enemy.emoji);
const iconUrls = Object.values(uiIcons);
const preloaded = new Set<string>();

function preloadImage(src: string): Promise<void> {
  if (preloaded.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    const done = () => {
      preloaded.add(src);
      resolve();
    };

    img.onload = async () => {
      try {
        if ("decode" in img) {
          await img.decode();
        }
      } catch {
        // ignore decode errors
      }
      done();
    };

    img.onerror = () => done();
  });
}

export function preloadGameAssets(): Promise<void> {
  return Promise.all([...backgroundUrls, ...iconUrls].map(preloadImage)).then(() => undefined);
}

export function preloadStageAssets(stage: number): Promise<void> {
  const startIndex = ((stage - 1) * 3) % enemyUrls.length;
  const enemyWindow = Array.from({ length: 5 }, (_, index) => enemyUrls[(startIndex + index) % enemyUrls.length]);

  const urls = new Set<string>([
    ...backgroundUrls,
    ...iconUrls,
    ...enemyWindow,
    bossEnemies[Math.floor((stage - 1) / 5) % bossEnemies.length].emoji,
  ]);

  return Promise.all([...urls].map(preloadImage)).then(() => undefined);
}
