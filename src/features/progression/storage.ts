import type { SaveData } from "../../types/game";

const STORAGE_KEY = "math-quest-save";

export const defaultSave: SaveData = {
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

function getStorage() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function normalizeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function cloneDefaultSave(): SaveData {
  return {
    ...defaultSave,
    stars: { ...defaultSave.stars },
    upgrades: { ...defaultSave.upgrades },
    player: { ...defaultSave.player },
  };
}

export function loadSave(): SaveData {
  const storage = getStorage();

  if (!storage) {
    return cloneDefaultSave();
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);

    if (!raw) {
      return cloneDefaultSave();
    }

    const parsed = JSON.parse(raw);
    const fallback = cloneDefaultSave();

    const starsEntries = Object.entries(
      parsed?.stars && typeof parsed.stars === "object" ? parsed.stars : {},
    )
      .map(([stage, value]) => [Number(stage), Number(value)] as const)
      .filter(([stage, value]) => Number.isFinite(stage) && Number.isFinite(value));

    return {
      bestScore: normalizeNumber(parsed?.bestScore, fallback.bestScore),
      playerLevel: normalizeNumber(
        parsed?.playerLevel ?? parsed?.level,
        fallback.playerLevel,
      ),
      playerXp: normalizeNumber(parsed?.playerXp ?? parsed?.xp, fallback.playerXp),
      unlockedStage: normalizeNumber(
        parsed?.unlockedStage ?? parsed?.level,
        fallback.unlockedStage,
      ),
      stars: Object.fromEntries(starsEntries),
      upgrades: {
        hp: normalizeNumber(parsed?.upgrades?.hp, fallback.upgrades.hp),
        damage: normalizeNumber(
          parsed?.upgrades?.damage,
          fallback.upgrades.damage,
        ),
        hint: normalizeNumber(
          parsed?.upgrades?.hint ?? parsed?.upgrades?.time,
          fallback.upgrades.hint,
        ),
      },
      player: {
        hp: normalizeNumber(parsed?.player?.hp, fallback.player.hp),
        maxHp: normalizeNumber(parsed?.player?.maxHp, fallback.player.maxHp),
        coins: normalizeNumber(parsed?.player?.coins, fallback.player.coins),
        damage: normalizeNumber(parsed?.player?.damage, fallback.player.damage),
      },
    };
  } catch {
    return cloneDefaultSave();
  }
}

export function saveProgress(data: SaveData) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateBestScore(score: number) {
  const save = loadSave();

  saveProgress({
    ...save,
    bestScore: Math.max(save.bestScore, score),
  });
}

export function clearSave() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(STORAGE_KEY);
}
