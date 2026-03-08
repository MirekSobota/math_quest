import { create } from "zustand";
import type { GameState, Upgrade } from "../types/game";

import { generateQuestion } from "../features/questions/questionGenerator";
import { getRewardOptions } from "../features/progression/reward.utils";
import {
  loadSave,
  saveProgress,
  updateBestScore,
} from "../features/progression/storage";

import { getEnemyForStageSlot } from "../features/battle/battle.utils";
import {
  getSpellBonusDamage,
  getSpellLabel,
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

const save = loadSave();

function getAnswerCount() {
  return 4;
}

function appendRecentQuestion(
  recentQuestionKeys: string[],
  key: string,
): string[] {
  return [...recentQuestionKeys, key].slice(-5);
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: "menu",

  playerLevel: save.playerLevel,
  playerXp: save.playerXp,

  unlockedStage: save.unlockedStage,
  selectedStage: save.unlockedStage,

  score: 0,

  player: {
    hp: save.player.hp,
    maxHp: save.player.maxHp,
    energy: 0,
    coins: save.player.coins,
    streak: 0,
    damage: save.player.damage,
  },

  upgrades: save.upgrades,

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
    set((state) => ({
      screen: "map",
      selectedStage: state.unlockedStage,
    }));
  },

  goToMap: () => {
    set((state) => ({
      screen: "map",
      enemy: null,
      currentQuestion: null,
      rewardOptions: [],
      lastHit: null,
      activeSpell: "none",
      floatingMessage: "",
      mistakes: 0,
      selectedStage: state.unlockedStage,
      earnedStars: 0,
      completedStage: null,
      completedWasLatest: false,
      correctAnswersOnCurrentEnemy: 0,
      stageEnemyIndex: 1,
      stageEnemyCount: getStageEnemyCount(state.unlockedStage),
      lessonQuestionIndex: 0,
      lessonQuestionCount: getLessonQuestionCount(state.unlockedStage),
      recentQuestionKeys: [],
      hintCharges: state.upgrades.hint,
      hiddenAnswers: [],
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
    if (stage > state.unlockedStage) return;

    sounds.click();
    set({ selectedStage: stage });
  },

  startStage: () => {
    const state = get();
    const stageToPlay = state.selectedStage;
    const enemyCount = getStageEnemyCount(stageToPlay);

    const enemy = getEnemyForStageSlot(stageToPlay, 1, enemyCount);
    const firstQuestion = generateQuestion(stageToPlay, getAnswerCount(), []);

    sounds.click();

    set({
      screen: "battle",
      enemy,
      currentQuestion: firstQuestion,
      lastHit: null,
      activeSpell: getSpellTier(state.player.streak),
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
    });

    if (enemy.isBoss) {
      setTimeout(() => set({ floatingMessage: "" }), 900);
    }
  },

  continueAfterLevelComplete: () => {
    const state = get();

    sounds.click();

    const shouldShowReward =
      state.completedWasLatest && state.unlockedStage % 3 === 0;

    if (shouldShowReward) {
      set({
        screen: "reward",
        rewardOptions: getRewardOptions(),
      });
      return;
    }

    set({
      screen: "map",
      selectedStage: state.unlockedStage,
      earnedStars: 0,
      completedStage: null,
      completedWasLatest: false,
      correctAnswersOnCurrentEnemy: 0,
      stageEnemyIndex: 1,
      stageEnemyCount: getStageEnemyCount(state.unlockedStage),
      lessonQuestionIndex: 0,
      lessonQuestionCount: getLessonQuestionCount(state.unlockedStage),
      recentQuestionKeys: [],
      hintCharges: state.upgrades.hint,
      hiddenAnswers: [],
    });
  },

  useHint: () => {
    const state = get();

    if (!state.currentQuestion || state.hintCharges <= 0) return;

    const question = state.currentQuestion;

    const wrongAnswers = question.answers.filter(
      (answer) =>
        answer !== question.correctAnswer &&
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
      const spellLabel = getSpellLabel(spell);

      const rawEnemyHp = state.enemy.hp - totalDamage;
      const nextScore = state.score + 10 + bonusDamage * 5;
      const nextCorrectAnswers = state.correctAnswersOnCurrentEnemy + 1;
      const nextLessonQuestionIndex = state.lessonQuestionIndex + 1;

      const reachedAnswerGoal =
        nextCorrectAnswers >= state.enemy.requiredCorrectAnswers;

      const canDefeatEnemy = rawEnemyHp <= 0 && reachedAnswerGoal;

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

          const currentSave = loadSave();

          saveProgress({
            ...currentSave,
            bestScore: Math.max(currentSave.bestScore, nextScore),
            playerLevel: xpResult.level,
            playerXp: xpResult.xp,
            unlockedStage: state.unlockedStage,
            upgrades: currentSave.upgrades,
            stars: currentSave.stars,
            player: {
              hp: updatedPlayer.hp,
              maxHp: updatedPlayer.maxHp,
              coins: updatedPlayer.coins,
              damage: updatedPlayer.damage,
            },
          });

          set({
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

          setTimeout(() => {
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

          setTimeout(() => {
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
          ? state.unlockedStage + 1
          : state.unlockedStage;

        let stars = 1;
        if (state.mistakes === 0) stars = 3;
        else if (state.mistakes === 1) stars = 2;

        const currentSave = loadSave();

        saveProgress({
          ...currentSave,
          bestScore: Math.max(currentSave.bestScore, nextScore),
          playerLevel: xpResult.level,
          playerXp: xpResult.xp,
          unlockedStage: nextUnlockedStage,
          stars: {
            ...currentSave.stars,
            [stageToPlay]: Math.max(currentSave.stars[stageToPlay] ?? 0, stars),
          },
          upgrades: currentSave.upgrades,
          player: {
            hp: updatedPlayer.hp,
            maxHp: updatedPlayer.maxHp,
            coins: updatedPlayer.coins,
            damage: updatedPlayer.damage,
          },
        });

        set({
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
          earnedStars: stars,
          completedStage: stageToPlay,
          completedWasLatest: isLatestStage,
          correctAnswersOnCurrentEnemy: 0,
          stageEnemyIndex: 1,
          stageEnemyCount: getStageEnemyCount(nextUnlockedStage),
          lessonQuestionIndex: nextLessonQuestionIndex,
          lessonQuestionCount: getLessonQuestionCount(nextUnlockedStage),
          recentQuestionKeys: [],
          hiddenAnswers: [],
        });

        setTimeout(() => {
          set({
            lastHit: null,
            floatingMessage: "",
          });
        }, 900);

        return;
      }

      const displayedEnemyHp = Math.max(1, rawEnemyHp);

      const nextQuestion = generateQuestion(
        stageToPlay,
        getAnswerCount(),
        state.recentQuestionKeys,
      );

      set({
        score: nextScore,
        enemy: {
          ...state.enemy,
          hp: displayedEnemyHp,
        },
        currentQuestion: nextQuestion,
        lastHit: "correct",
        activeSpell: spell,
        floatingMessage: spell === "none" ? "✨ Great!" : spellLabel,
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

      setTimeout(() => {
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
      updateBestScore(state.score);
      sounds.gameOver();

      const revivedPlayer = {
        ...state.player,
        hp: state.player.maxHp,
        streak: 0,
      };

      const currentSave = loadSave();

      saveProgress({
        ...currentSave,
        playerLevel: state.playerLevel,
        playerXp: state.playerXp,
        unlockedStage: state.unlockedStage,
        upgrades: currentSave.upgrades,
        player: {
          hp: revivedPlayer.hp,
          maxHp: revivedPlayer.maxHp,
          coins: revivedPlayer.coins,
          damage: revivedPlayer.damage,
        },
      });

      set({
        screen: "gameover",
        player: revivedPlayer,
        floatingMessage: isBoss ? "👑 Boss hit!" : "💥 Oops!",
        mistakes: newMistakes,
        activeSpell: "none",
        lastHit: "wrong",
      });

      setTimeout(() => {
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

    const currentSave = loadSave();

    saveProgress({
      ...currentSave,
      playerLevel: state.playerLevel,
      playerXp: state.playerXp,
      unlockedStage: state.unlockedStage,
      player: {
        hp: updatedPlayer.hp,
        maxHp: updatedPlayer.maxHp,
        coins: updatedPlayer.coins,
        damage: updatedPlayer.damage,
      },
    });

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

    setTimeout(() => {
      set({
        lastHit: null,
        floatingMessage: "",
      });
    }, 700);
  },

  pickReward: (upgrade) => {
    sounds.click();

    const state = get();
    let updatedPlayer = { ...state.player };

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

    const currentSave = loadSave();

    saveProgress({
      ...currentSave,
      playerLevel: state.playerLevel,
      playerXp: state.playerXp,
      unlockedStage: state.unlockedStage,
      player: {
        hp: updatedPlayer.hp,
        maxHp: updatedPlayer.maxHp,
        coins: updatedPlayer.coins,
        damage: updatedPlayer.damage,
      },
    });

    set({
      screen: "map",
      player: updatedPlayer,
      selectedStage: state.unlockedStage,
    });
  },

  buyItem: (id) => {
    const state = get();
    const currentSave = loadSave();

    let player = { ...state.player };
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

    saveProgress({
      ...currentSave,
      playerLevel: state.playerLevel,
      playerXp: state.playerXp,
      unlockedStage: state.unlockedStage,
      upgrades,
      player: {
        hp: player.hp,
        maxHp: player.maxHp,
        coins: player.coins,
        damage: player.damage,
      },
    });

    set({
      player,
      upgrades,
    });
  },
}));
