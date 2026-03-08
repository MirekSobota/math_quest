import type { SaveData } from "../../types/game";

const STORAGE_KEY = "math-quest-save";

const defaultSave: SaveData = {
  bestScore: 0,
  playerLevel: 1,
  playerXp: 0,
  unlockedStage: 1,
  stars: {},
  upgrades: {
    hp: 0,
    damage: 0,
    hint: 0,
  },
  player: {
    hp: 3,
    maxHp: 3,
    coins: 0,
    damage: 1,
  },
};

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return defaultSave;

    const parsed = JSON.parse(raw);

    return {
      bestScore:
        typeof parsed?.bestScore === "number"
          ? parsed.bestScore
          : defaultSave.bestScore,

      playerLevel:
        typeof parsed?.playerLevel === "number"
          ? parsed.playerLevel
          : typeof parsed?.level === "number"
            ? parsed.level
            : defaultSave.playerLevel,

      playerXp:
        typeof parsed?.playerXp === "number"
          ? parsed.playerXp
          : typeof parsed?.xp === "number"
            ? parsed.xp
            : defaultSave.playerXp,

      unlockedStage:
        typeof parsed?.unlockedStage === "number"
          ? parsed.unlockedStage
          : typeof parsed?.level === "number"
            ? parsed.level
            : defaultSave.unlockedStage,

      stars:
        parsed?.stars && typeof parsed.stars === "object"
          ? parsed.stars
          : defaultSave.stars,

      upgrades: {
        hp:
          typeof parsed?.upgrades?.hp === "number"
            ? parsed.upgrades.hp
            : defaultSave.upgrades.hp,

        damage:
          typeof parsed?.upgrades?.damage === "number"
            ? parsed.upgrades.damage
            : defaultSave.upgrades.damage,

        hint:
          typeof parsed?.upgrades?.hint === "number"
            ? parsed.upgrades.hint
            : typeof parsed?.upgrades?.time === "number"
              ? parsed.upgrades.time
              : defaultSave.upgrades.hint,
      },

      player: {
        hp:
          typeof parsed?.player?.hp === "number"
            ? parsed.player.hp
            : defaultSave.player.hp,

        maxHp:
          typeof parsed?.player?.maxHp === "number"
            ? parsed.player.maxHp
            : defaultSave.player.maxHp,

        coins:
          typeof parsed?.player?.coins === "number"
            ? parsed.player.coins
            : defaultSave.player.coins,

        damage:
          typeof parsed?.player?.damage === "number"
            ? parsed.player.damage
            : defaultSave.player.damage,
      },
    };
  } catch {
    return defaultSave;
  }
}

export function saveProgress(data: SaveData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateBestScore(score: number) {
  const save = loadSave();

  saveProgress({
    ...save,
    bestScore: Math.max(save.bestScore, score),
  });
}

export function clearSave() {
  localStorage.removeItem(STORAGE_KEY);
}
