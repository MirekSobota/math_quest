import { create } from "zustand";
import type { GameState, SaveData, Upgrade } from "../types/game";

import { clampStage } from "../data/levels";
import { generateQuestion } from "../features/questions/questionGenerator";
import { getRewardOptions } from "../features/progression/reward.utils";
import {
  getStarsForMistakes,
  shouldOfferRewardForStage,
} from "../features/progression/progression.utils";
import { loadSave, saveProgress } from "../features/progression/storage";

import { getEnemyForStageSlot } from "../features/battle/battle.utils";
import { applyXpGain } from "../features/progression/xp.utils";
import { getUpgradePrice, getUpgradeMax } from "../features/shop/shop.utils";
import {
  getLessonQuestionCount,
  getStageEnemyCount,
} from "../features/battle/stage.utils";
import { sounds } from "../features/audio/sounds";

type ShopItemId = "hp" | "hint" | "shield" | "secondChance" | "starBonus";

type GameStore = GameState & {
  floatingMessage: string;
  upgrades: {
    hp: number;
    hint: number;
    shield: number;
    secondChance: number;
    starBonus: number;
  };
  startGame: () => void;
  goToMap: () => void;
  openStats: () => void;
  openShop: () => void;
  buyItem: (id: ShopItemId) => void;
  selectStage: (stage: number) => void;
  startStage: () => void;
  continueAfterLevelComplete: () => void;
  useHint: () => void;
  answerQuestion: (answer: number) => void;
  pickReward: (upgrade: Upgrade) => void;
};

const initialSave = loadSave();
const activeTimeouts = new Set<number>();

function getAnswerCount() {
  return 4;
}

function clearScheduledUiEffects() {
  for (const timeoutId of activeTimeouts) {
    window.clearTimeout(timeoutId);
  }

  activeTimeouts.clear();
}

function scheduleUiEffect(callback: () => void, delay: number) {
  const timeoutId = window.setTimeout(() => {
    activeTimeouts.delete(timeoutId);
    callback();
  }, delay);

  activeTimeouts.add(timeoutId);
}

function appendRecentQuestion(recentQuestionKeys: string[], key: string): string[] {
  return [...recentQuestionKeys, key].slice(-5);
}

function createSavePayload(
  state: Pick<
    GameStore,
    | "bestScore"
    | "playerLevel"
    | "playerXp"
    | "unlockedStage"
    | "stars"
    | "upgrades"
    | "player"
  >,
): SaveData {
  return {
    bestScore: state.bestScore,
    playerLevel: state.playerLevel,
    playerXp: state.playerXp,
    unlockedStage: state.unlockedStage,
    stars: state.stars,
    upgrades: state.upgrades,
    player: {
      hp: state.player.hp,
      maxHp: state.player.maxHp,
      coins: state.player.coins,
    },
  };
}

function getMapResetState(
  selectedStage: number,
  upgrades: Pick<GameStore["upgrades"], "hint" | "shield" | "secondChance">,
) {
  return {
    enemy: null,
    currentQuestion: null,
    rewardOptions: [],
    lastHit: null,
    floatingMessage: "",
    mistakes: 0,
    earnedStars: 0,
    completedStage: null,
    completedWasLatest: false,
    stageEnemyIndex: 1,
    stageEnemyCount: getStageEnemyCount(selectedStage),
    lessonQuestionIndex: 0,
    lessonQuestionCount: getLessonQuestionCount(selectedStage),
    recentQuestionKeys: [],
    hintCharges: upgrades.hint,
    shieldCharges: upgrades.shield,
    secondChanceCharges: upgrades.secondChance,
    hiddenAnswers: [],
  };
}

function applyPermanentUpgrade(state: GameStore, upgrade: Upgrade) {
  const player = { ...state.player };
  const upgrades = { ...state.upgrades };

  if (upgrade.type === "heart") {
    const value = Math.min(upgrade.value, getUpgradeMax("hp") - upgrades.hp);
    if (value > 0) {
      upgrades.hp += value;
      player.maxHp += value;
      player.hp += value;
    }
  }

  if (upgrade.type === "hint") {
    upgrades.hint = Math.min(getUpgradeMax("hint"), upgrades.hint + upgrade.value);
  }

  if (upgrade.type === "shield") {
    upgrades.shield = Math.min(
      getUpgradeMax("shield"),
      upgrades.shield + upgrade.value,
    );
  }

  if (upgrade.type === "secondChance") {
    upgrades.secondChance = Math.min(
      getUpgradeMax("secondChance"),
      upgrades.secondChance + upgrade.value,
    );
  }

  if (upgrade.type === "starBonus") {
    upgrades.starBonus = Math.min(
      getUpgradeMax("starBonus"),
      upgrades.starBonus + upgrade.value,
    );
  }

  if (upgrade.type === "coins") {
    player.coins += upgrade.value;
  }

  return { player, upgrades };
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: "menu",

  bestScore: initialSave.bestScore,
  stars: initialSave.stars,

  playerLevel: initialSave.playerLevel,
  playerXp: initialSave.playerXp,

  unlockedStage: initialSave.unlockedStage,
  selectedStage: initialSave.unlockedStage,

  score: 0,

  player: {
    hp: initialSave.player.hp,
    maxHp: initialSave.player.maxHp,
    coins: initialSave.player.coins,
  },

  upgrades: initialSave.upgrades,

  enemy: null,
  currentQuestion: null,
  rewardOptions: [],

  lastHit: null,

  mistakes: 0,

  earnedStars: 0,
  completedStage: null,
  completedWasLatest: false,

  stageEnemyIndex: 1,
  stageEnemyCount: 3,

  lessonQuestionIndex: 0,
  lessonQuestionCount: 5,

  recentQuestionKeys: [],
  hintCharges: initialSave.upgrades.hint,
  shieldCharges: initialSave.upgrades.shield,
  secondChanceCharges: initialSave.upgrades.secondChance,
  hiddenAnswers: [],

  floatingMessage: "",

  startGame: () => {
    sounds.click();
    clearScheduledUiEffects();

    set((state) => ({
      screen: "map",
      selectedStage: clampStage(state.unlockedStage),
      ...getMapResetState(clampStage(state.unlockedStage), state.upgrades),
    }));
  },

  goToMap: () => {
    clearScheduledUiEffects();

    set((state) => ({
      screen: "map",
      selectedStage: clampStage(state.unlockedStage),
      ...getMapResetState(clampStage(state.unlockedStage), state.upgrades),
    }));
  },

  openStats: () => {
    sounds.click();
    set({ screen: "stats" });
  },

  openShop: () => {
    sounds.click();
    set({ screen: "shop" });
  },

  selectStage: (stage) => {
    const state = get();
    const nextStage = clampStage(stage);
    if (nextStage > state.unlockedStage) return;

    sounds.click();
    set({ selectedStage: nextStage });
  },

  startStage: () => {
    const state = get();
    const stageToPlay = clampStage(state.selectedStage);
    const enemyCount = getStageEnemyCount(stageToPlay);
    const enemy = getEnemyForStageSlot(stageToPlay, 1, enemyCount);
    const firstQuestion = generateQuestion(stageToPlay, getAnswerCount(), []);

    sounds.click();
    clearScheduledUiEffects();

    set({
      screen: "battle",
      enemy,
      currentQuestion: firstQuestion,
      lastHit: null,
      floatingMessage: enemy.isBoss ? "👑 Boss fight!" : "",
      mistakes: 0,
      earnedStars: 0,
      completedStage: null,
      completedWasLatest: false,
      stageEnemyIndex: 1,
      stageEnemyCount: enemyCount,
      lessonQuestionIndex: 0,
      lessonQuestionCount: getLessonQuestionCount(stageToPlay),
      recentQuestionKeys: [firstQuestion.key],
      hintCharges: state.upgrades.hint,
      shieldCharges: state.upgrades.shield,
      secondChanceCharges: state.upgrades.secondChance,
      hiddenAnswers: [],
      player: {
        ...state.player,
        hp: state.player.maxHp,
      },
      selectedStage: stageToPlay,
    });

    if (enemy.isBoss) {
      scheduleUiEffect(() => set({ floatingMessage: "" }), 900);
    }
  },

  continueAfterLevelComplete: () => {
    const state = get();

    sounds.click();
    clearScheduledUiEffects();

    const shouldShowReward = shouldOfferRewardForStage(
      state.completedStage,
      state.completedWasLatest,
    );

    if (shouldShowReward) {
      set({
        screen: "reward",
        rewardOptions: getRewardOptions(),
      });
      return;
    }

    set({
      screen: "map",
      selectedStage: clampStage(state.unlockedStage),
      ...getMapResetState(clampStage(state.unlockedStage), state.upgrades),
    });
  },

  useHint: () => {
    const state = get();

    if (!state.currentQuestion || state.hintCharges <= 0) return;

    const wrongAnswers = state.currentQuestion.answers.filter(
      (answer) =>
        answer !== state.currentQuestion?.correctAnswer &&
        !state.hiddenAnswers.includes(answer),
    );

    if (wrongAnswers.length === 0) return;

    sounds.click();

    set({
      hintCharges: state.hintCharges - 1,
      hiddenAnswers: [...state.hiddenAnswers, wrongAnswers[0]],
    });
  },

  answerQuestion: (answer) => {
    const state = get();
    if (!state.currentQuestion || !state.enemy) return;

    const stageToPlay = state.selectedStage;
    const isBoss = !!state.enemy.isBoss;
    const isCorrect = answer === state.currentQuestion.correctAnswer;

    if (isCorrect) {
      sounds.correct();

      const nextEnemyHp = Math.max(0, state.enemy.hp - 1);
      const nextScore = state.score + 10;
      const nextBestScore = Math.max(state.bestScore, nextScore);
      const nextLessonQuestionIndex = state.lessonQuestionIndex + 1;

      if (nextEnemyHp <= 0) {
        const xpResult = applyXpGain(
          state.playerLevel,
          state.playerXp,
          state.enemy.xpReward,
        );

        const updatedPlayer = {
          ...state.player,
          coins: state.player.coins + (isBoss ? 16 : 5),
        };

        const nextEnemyIndex = state.stageEnemyIndex + 1;
        const stageFinished = nextEnemyIndex > state.stageEnemyCount;

        if (!stageFinished) {
          const nextEnemy = getEnemyForStageSlot(
            stageToPlay,
            nextEnemyIndex,
            state.stageEnemyCount,
          );

          const nextQuestion = generateQuestion(
            stageToPlay,
            getAnswerCount(),
            state.recentQuestionKeys,
          );

          saveProgress(
            createSavePayload({
              ...state,
              bestScore: nextBestScore,
              playerLevel: xpResult.level,
              playerXp: xpResult.xp,
              player: updatedPlayer,
            }),
          );

          clearScheduledUiEffects();

          set({
            bestScore: nextBestScore,
            playerLevel: xpResult.level,
            playerXp: xpResult.xp,
            score: nextScore,
            enemy: null,
            currentQuestion: null,
            lastHit: "correct",
            floatingMessage: nextEnemy.isBoss ? "👑 Boss!" : "✨ Next foe!",
            player: updatedPlayer,
            lessonQuestionIndex: nextLessonQuestionIndex,
            hiddenAnswers: [],
          });

          scheduleUiEffect(() => {
            set({
              enemy: nextEnemy,
              currentQuestion: nextQuestion,
              stageEnemyIndex: nextEnemyIndex,
              recentQuestionKeys: appendRecentQuestion(
                state.recentQuestionKeys,
                nextQuestion.key,
              ),
              floatingMessage: nextEnemy.isBoss ? "👑 Boss fight!" : "",
            });
          }, 360);

          scheduleUiEffect(() => {
            set({
              lastHit: null,
              floatingMessage: "",
            });
          }, 860);

          return;
        }

        if (isBoss) {
          sounds.bossWin();
        }

        const isLatestStage = stageToPlay === state.unlockedStage;
        const nextUnlockedStage = isLatestStage
          ? clampStage(state.unlockedStage + 1)
          : state.unlockedStage;
        const earnedStars = Math.min(
          3,
          getStarsForMistakes(state.mistakes) + Math.min(1, state.upgrades.starBonus),
        );
        const nextStars = {
          ...state.stars,
          [stageToPlay]: Math.max(state.stars[stageToPlay] ?? 0, earnedStars),
        };

        saveProgress(
          createSavePayload({
            ...state,
            bestScore: nextBestScore,
            stars: nextStars,
            playerLevel: xpResult.level,
            playerXp: xpResult.xp,
            unlockedStage: nextUnlockedStage,
            player: updatedPlayer,
          }),
        );

        clearScheduledUiEffects();

        set({
          bestScore: nextBestScore,
          stars: nextStars,
          playerLevel: xpResult.level,
          playerXp: xpResult.xp,
          unlockedStage: nextUnlockedStage,
          selectedStage: nextUnlockedStage,
          score: nextScore,
          screen: "levelcomplete",
          enemy: null,
          currentQuestion: null,
          rewardOptions: [],
          lastHit: "correct",
          floatingMessage: isBoss
            ? `👑 Boss cleared! +${state.enemy.xpReward} XP`
            : `✨ Stage cleared! +${state.enemy.xpReward} XP`,
          player: updatedPlayer,
          mistakes: 0,
          earnedStars,
          completedStage: stageToPlay,
          completedWasLatest: isLatestStage,
          stageEnemyIndex: 1,
          stageEnemyCount: getStageEnemyCount(nextUnlockedStage),
          lessonQuestionIndex: nextLessonQuestionIndex,
          lessonQuestionCount: getLessonQuestionCount(nextUnlockedStage),
          recentQuestionKeys: [],
          hintCharges: state.upgrades.hint,
          shieldCharges: state.upgrades.shield,
          secondChanceCharges: state.upgrades.secondChance,
          hiddenAnswers: [],
        });

        scheduleUiEffect(() => {
          set({
            lastHit: null,
            floatingMessage: "",
          });
        }, 900);

        return;
      }

      const nextQuestion = generateQuestion(
        stageToPlay,
        getAnswerCount(),
        state.recentQuestionKeys,
      );

      set({
        bestScore: nextBestScore,
        score: nextScore,
        enemy: {
          ...state.enemy,
          hp: nextEnemyHp,
        },
        currentQuestion: nextQuestion,
        lastHit: "correct",
        floatingMessage: "✨ Nice!",
        lessonQuestionIndex: nextLessonQuestionIndex,
        recentQuestionKeys: appendRecentQuestion(
          state.recentQuestionKeys,
          nextQuestion.key,
        ),
        hiddenAnswers: [],
      });

      scheduleUiEffect(() => {
        set({
          lastHit: null,
          floatingMessage: "",
        });
      }, 650);

      return;
    }

    sounds.wrong();

    const nextQuestion = generateQuestion(
      stageToPlay,
      getAnswerCount(),
      state.recentQuestionKeys,
    );
    const nextRecentQuestionKeys = appendRecentQuestion(
      state.recentQuestionKeys,
      nextQuestion.key,
    );
    const nextMistakes = state.mistakes + 1;

    if (state.shieldCharges > 0) {
      set({
        currentQuestion: nextQuestion,
        shieldCharges: state.shieldCharges - 1,
        mistakes: nextMistakes,
        lastHit: "wrong",
        floatingMessage: "🛡️ Shield!",
        recentQuestionKeys: nextRecentQuestionKeys,
        hiddenAnswers: [],
      });

      scheduleUiEffect(() => {
        set({
          lastHit: null,
          floatingMessage: "",
        });
      }, 700);
      return;
    }

    const newPlayerHp = state.player.hp - 1;

    if (newPlayerHp <= 0 && state.secondChanceCharges > 0) {
      const revivedPlayer = {
        ...state.player,
        hp: 1,
      };

      saveProgress(
        createSavePayload({
          ...state,
          player: revivedPlayer,
        }),
      );

      set({
        currentQuestion: nextQuestion,
        player: revivedPlayer,
        secondChanceCharges: state.secondChanceCharges - 1,
        mistakes: nextMistakes,
        lastHit: "wrong",
        floatingMessage: "💖 One more chance!",
        recentQuestionKeys: nextRecentQuestionKeys,
        hiddenAnswers: [],
      });

      scheduleUiEffect(() => {
        set({
          lastHit: null,
          floatingMessage: "",
        });
      }, 800);
      return;
    }

    if (newPlayerHp <= 0) {
      const nextBestScore = Math.max(state.bestScore, state.score);
      sounds.gameOver();

      const revivedPlayer = {
        ...state.player,
        hp: state.player.maxHp,
      };

      saveProgress(
        createSavePayload({
          ...state,
          bestScore: nextBestScore,
          player: revivedPlayer,
        }),
      );

      clearScheduledUiEffects();

      set({
        bestScore: nextBestScore,
        screen: "gameover",
        player: revivedPlayer,
        floatingMessage: isBoss ? "👑 Boss hit!" : "💥 Oops!",
        mistakes: nextMistakes,
        lastHit: "wrong",
      });

      scheduleUiEffect(() => {
        set({
          lastHit: null,
          floatingMessage: "",
        });
      }, 700);

      return;
    }

    const updatedPlayer = {
      ...state.player,
      hp: newPlayerHp,
    };

    saveProgress(
      createSavePayload({
        ...state,
        player: updatedPlayer,
      }),
    );

    set({
      currentQuestion: nextQuestion,
      player: updatedPlayer,
      mistakes: nextMistakes,
      lastHit: "wrong",
      floatingMessage: "💥 Try again!",
      recentQuestionKeys: nextRecentQuestionKeys,
      hiddenAnswers: [],
    });

    scheduleUiEffect(() => {
      set({
        lastHit: null,
        floatingMessage: "",
      });
    }, 700);
  },

  pickReward: (upgrade) => {
    sounds.click();
    clearScheduledUiEffects();

    const state = get();
    const { player, upgrades } = applyPermanentUpgrade(state, upgrade);

    saveProgress(
      createSavePayload({
        ...state,
        player,
        upgrades,
      }),
    );

    set({
      screen: "map",
      player,
      upgrades,
      selectedStage: clampStage(state.unlockedStage),
      ...getMapResetState(clampStage(state.unlockedStage), upgrades),
    });
  },

  buyItem: (id) => {
    const state = get();

    const player = { ...state.player };
    const upgrades = { ...state.upgrades };

    const buyUpgrade = (key: keyof typeof upgrades, basePrice: number) => {
      const currentLevel = upgrades[key];
      const maxLevel = getUpgradeMax(key);
      if (currentLevel >= maxLevel) return false;

      const price = getUpgradePrice(basePrice, currentLevel);
      if (player.coins < price) return false;

      player.coins -= price;
      upgrades[key] += 1;
      return true;
    };

    let didBuy = false;

    if (id === "hp") {
      didBuy = buyUpgrade("hp", 40);
      if (didBuy) {
        player.maxHp += 1;
        player.hp += 1;
      }
    }

    if (id === "hint") {
      didBuy = buyUpgrade("hint", 55);
    }

    if (id === "shield") {
      didBuy = buyUpgrade("shield", 70);
    }

    if (id === "secondChance") {
      didBuy = buyUpgrade("secondChance", 90);
    }

    if (id === "starBonus") {
      didBuy = buyUpgrade("starBonus", 120);
    }

    if (!didBuy) return;

    sounds.click();

    saveProgress(
      createSavePayload({
        ...state,
        upgrades,
        player,
      }),
    );

    set({
      player,
      upgrades,
    });
  },
}));
