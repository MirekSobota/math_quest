import { create } from "zustand";
import type { GameState, SaveData, Upgrade } from "../types/game";

import { clampStage } from "../data/levels";
import { generateQuestion } from "../features/questions/questionGenerator";
import { getRewardOptions } from "../features/progression/reward.utils";
import { getStarsForMistakes, shouldOfferRewardForStage } from "../features/progression/progression.utils";
import { loadSave, saveProgress } from "../features/progression/storage";

import { getEnemyForStageSlot } from "../features/battle/battle.utils";
import {
  getSpellBonusDamage,
  getSpellTier,
} from "../features/battle/spells.utils";

import { applyXpGain } from "../features/progression/xp.utils";
import { getUpgradePrice, getUpgradeMax } from "../features/shop/shop.utils";
import {
  getLessonQuestionCount,
  getStageEnemyCount,
} from "../features/battle/stage.utils";
import { sounds } from "../features/audio/sounds";

type ShopItemId = "hp" | "damage" | "hint";

type GameStore = GameState & {
  floatingMessage: string;
  upgrades: {
    hp: number;
    damage: number;
    hint: number;
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

function appendRecentQuestion(
  recentQuestionKeys: string[],
  key: string,
): string[] {
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
      damage: state.player.damage,
    },
  };
}

function getMapResetState(selectedStage: number, hintLevel: number) {
  return {
    enemy: null,
    currentQuestion: null,
    rewardOptions: [],
    lastHit: null,
    activeSpell: "none" as const,
    floatingMessage: "",
    mistakes: 0,
    earnedStars: 0,
    completedStage: null,
    completedWasLatest: false,
    correctAnswersOnCurrentEnemy: 0,
    stageEnemyIndex: 1,
    stageEnemyCount: getStageEnemyCount(selectedStage),
    lessonQuestionIndex: 0,
    lessonQuestionCount: getLessonQuestionCount(selectedStage),
    recentQuestionKeys: [],
    hintCharges: hintLevel,
    hiddenAnswers: [],
  };
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
    energy: 0,
    coins: initialSave.player.coins,
    streak: 0,
    damage: initialSave.player.damage,
  },

  upgrades: initialSave.upgrades,

  enemy: null,
  currentQuestion: null,
  rewardOptions: [],

  lastHit: null,
  activeSpell: "none",

  mistakes: 0,

  earnedStars: 0,
  completedStage: null,
  completedWasLatest: false,

  correctAnswersOnCurrentEnemy: 0,

  stageEnemyIndex: 1,
  stageEnemyCount: 3,

  lessonQuestionIndex: 0,
  lessonQuestionCount: 5,

  recentQuestionKeys: [],
  hintCharges: 0,
  hiddenAnswers: [],

  floatingMessage: "",

  startGame: () => {
    sounds.click();
    clearScheduledUiEffects();

    set((state) => ({
      screen: "map",
      selectedStage: clampStage(state.unlockedStage),
      ...getMapResetState(clampStage(state.unlockedStage), state.upgrades.hint),
    }));
  },

  goToMap: () => {
    clearScheduledUiEffects();

    set((state) => ({
      screen: "map",
      selectedStage: clampStage(state.unlockedStage),
      ...getMapResetState(clampStage(state.unlockedStage), state.upgrades.hint),
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
      activeSpell: "none",
      floatingMessage: enemy.isBoss ? "👑 Boss Fight!" : "",
      mistakes: 0,
      earnedStars: 0,
      completedStage: null,
      completedWasLatest: false,
      correctAnswersOnCurrentEnemy: 0,
      stageEnemyIndex: 1,
      stageEnemyCount: enemyCount,
      lessonQuestionIndex: 0,
      lessonQuestionCount: getLessonQuestionCount(stageToPlay),
      recentQuestionKeys: [firstQuestion.key],
      hintCharges: state.upgrades.hint,
      hiddenAnswers: [],
      player: {
        ...state.player,
        streak: 0,
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
      ...getMapResetState(clampStage(state.unlockedStage), state.upgrades.hint),
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

      const nextStreak = state.player.streak + 1;
      const spell = getSpellTier(nextStreak);
      const bonusDamage = getSpellBonusDamage(spell);
      const totalDamage = state.player.damage + bonusDamage;

      const nextEnemyHp = Math.max(0, state.enemy.hp - totalDamage);
      const nextScore = state.score + 10 + bonusDamage * 5;
      const nextBestScore = Math.max(state.bestScore, nextScore);
      const nextCorrectAnswers = state.correctAnswersOnCurrentEnemy + 1;
      const nextLessonQuestionIndex = state.lessonQuestionIndex + 1;

      const reachedAnswerGoal =
        nextCorrectAnswers >= state.enemy.requiredCorrectAnswers;
      const canDefeatEnemy = nextEnemyHp <= 0 && reachedAnswerGoal;

      if (canDefeatEnemy) {
        const xpResult = applyXpGain(
          state.playerLevel,
          state.playerXp,
          state.enemy.xpReward,
        );

        const updatedPlayer = {
          ...state.player,
          coins: state.player.coins + 5 + bonusDamage + (isBoss ? 10 : 0),
          streak: nextStreak,
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
            activeSpell: spell,
            floatingMessage: nextEnemy.isBoss
              ? "👑 Boss incoming!"
              : "✨ Enemy defeated!",
            player: updatedPlayer,
            correctAnswersOnCurrentEnemy: 0,
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
              floatingMessage: nextEnemy.isBoss ? "👑 Boss Fight!" : "",
            });
          }, 420);

          scheduleUiEffect(() => {
            set({
              lastHit: null,
              floatingMessage: "",
            });
          }, 900);

          return;
        }

        if (isBoss) {
          sounds.bossWin();
        }

        const isLatestStage = stageToPlay === state.unlockedStage;
        const nextUnlockedStage = isLatestStage
          ? clampStage(state.unlockedStage + 1)
          : state.unlockedStage;
        const earnedStars = getStarsForMistakes(state.mistakes);
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
          activeSpell: spell,
          floatingMessage: isBoss
            ? `👑 Boss Stage Cleared! +${state.enemy.xpReward} XP`
            : `✨ Stage Cleared! +${state.enemy.xpReward} XP`,
          player: updatedPlayer,
          mistakes: 0,
          earnedStars,
          completedStage: stageToPlay,
          completedWasLatest: isLatestStage,
          correctAnswersOnCurrentEnemy: 0,
          stageEnemyIndex: 1,
          stageEnemyCount: getStageEnemyCount(nextUnlockedStage),
          lessonQuestionIndex: nextLessonQuestionIndex,
          lessonQuestionCount: getLessonQuestionCount(nextUnlockedStage),
          recentQuestionKeys: [],
          hintCharges: state.upgrades.hint,
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
        activeSpell: spell,
        floatingMessage: spell === "none" ? "✨ Nice!" : "",
        player: {
          ...state.player,
          streak: nextStreak,
        },
        correctAnswersOnCurrentEnemy: nextCorrectAnswers,
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
      }, 700);

      return;
    }

    sounds.wrong();

    const newPlayerHp = state.player.hp - 1;
    const newMistakes = state.mistakes + 1;

    if (newPlayerHp <= 0) {
      const nextBestScore = Math.max(state.bestScore, state.score);
      sounds.gameOver();

      const revivedPlayer = {
        ...state.player,
        hp: state.player.maxHp,
        streak: 0,
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
        mistakes: newMistakes,
        activeSpell: "none",
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
      streak: 0,
    };

    const nextQuestion = generateQuestion(
      stageToPlay,
      getAnswerCount(),
      state.recentQuestionKeys,
    );

    saveProgress(
      createSavePayload({
        ...state,
        player: updatedPlayer,
      }),
    );

    set({
      currentQuestion: nextQuestion,
      player: updatedPlayer,
      mistakes: newMistakes,
      activeSpell: "none",
      lastHit: "wrong",
      floatingMessage: "💥 Try again!",
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
    }, 700);
  },

  pickReward: (upgrade) => {
    sounds.click();
    clearScheduledUiEffects();

    const state = get();
    const updatedPlayer = { ...state.player };

    if (upgrade.type === "heal") {
      updatedPlayer.hp = Math.min(
        updatedPlayer.maxHp,
        updatedPlayer.hp + upgrade.value,
      );
    }

    if (upgrade.type === "damage") {
      updatedPlayer.damage += upgrade.value;
    }

    if (upgrade.type === "coins") {
      updatedPlayer.coins += upgrade.value;
    }

    saveProgress(
      createSavePayload({
        ...state,
        player: updatedPlayer,
      }),
    );

    set({
      screen: "map",
      player: updatedPlayer,
      selectedStage: clampStage(state.unlockedStage),
      ...getMapResetState(clampStage(state.unlockedStage), state.upgrades.hint),
    });
  },

  buyItem: (id) => {
    const state = get();

    const player = { ...state.player };
    const upgrades = { ...state.upgrades };

    if (id === "hp") {
      const currentLevel = upgrades.hp;
      const maxLevel = getUpgradeMax("hp");
      if (currentLevel >= maxLevel) return;

      const price = getUpgradePrice(40, currentLevel);
      if (player.coins < price) return;

      player.coins -= price;
      upgrades.hp += 1;
      player.maxHp += 1;
      player.hp += 1;
    }

    if (id === "damage") {
      const currentLevel = upgrades.damage;
      const maxLevel = getUpgradeMax("damage");
      if (currentLevel >= maxLevel) return;

      const price = getUpgradePrice(60, currentLevel);
      if (player.coins < price) return;

      player.coins -= price;
      upgrades.damage += 1;
      player.damage += 1;
    }

    if (id === "hint") {
      const currentLevel = upgrades.hint;
      const maxLevel = getUpgradeMax("hint");
      if (currentLevel >= maxLevel) return;

      const price = getUpgradePrice(55, currentLevel);
      if (player.coins < price) return;

      player.coins -= price;
      upgrades.hint += 1;
    }

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
