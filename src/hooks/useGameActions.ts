import { useGameStore } from "../store/gameStore";

export function useGameActions() {
  return useGameStore((state) => ({
    startGame: state.startGame,
    goToMap: state.goToMap,
    openStats: state.openStats,
    openShop: state.openShop,
    selectStage: state.selectStage,
    startStage: state.startStage,
    continueAfterLevelComplete: state.continueAfterLevelComplete,
    useHint: state.useHint,
    answerQuestion: state.answerQuestion,
    pickReward: state.pickReward,
    buyItem: state.buyItem,
  }));
}
