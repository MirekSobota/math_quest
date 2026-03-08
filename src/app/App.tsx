import { useEffect } from "react";
import { GameShell } from "../components/layout/GameShell";
import { MenuScreen } from "../components/screens/MenuScreen";
import { BattleScreen } from "../components/screens/BattleScreen";
import { GameOverScreen } from "../components/screens/GameOverScreen";
import { RewardModal } from "../components/game/RewardModal";
import { MapScreen } from "../components/screens/MapScreen";
import { LevelCompleteScreen } from "../components/screens/LevelCompleteScreen";
import { ShopScreen } from "../components/screens/ShopScreen";
import { StatsScreen } from "../components/screens/StatsScreen";
import { useGameStore } from "../store/gameStore";
import { loadSave } from "../features/progression/storage";
import { preloadGameAssets } from "../features/assets/preloadGameAssets";

export default function App() {
  const {
    screen,
    playerLevel,
    playerXp,
    unlockedStage,
    selectedStage,
    score,
    player,
    upgrades,
    enemy,
    currentQuestion,
    rewardOptions,
    lastHit,
    floatingMessage,
    earnedStars,
    completedStage,
    completedWasLatest,
    correctAnswersOnCurrentEnemy,
    stageEnemyIndex,
    stageEnemyCount,
    lessonQuestionIndex,
    lessonQuestionCount,
    hintCharges,
    hiddenAnswers,
    startGame,
    goToMap,
    openShop,
    openStats,
    selectStage,
    startStage,
    continueAfterLevelComplete,
    useHint,
    answerQuestion,
    pickReward,
    buyItem,
  } = useGameStore();

  const { bestScore } = loadSave();

  useEffect(() => {
    preloadGameAssets();
  }, []);

  return (
    <GameShell>
      {screen === "menu" && (
        <MenuScreen onStart={startGame} bestScore={bestScore} />
      )}

      {screen === "map" && (
        <MapScreen
          unlockedStage={unlockedStage}
          selectedStage={selectedStage}
          playerLevel={playerLevel}
          playerXp={playerXp}
          coins={player.coins}
          onSelectStage={selectStage}
          onPlay={startStage}
          onShop={openShop}
          onStats={openStats}
        />
      )}

      {screen === "shop" && (
        <ShopScreen
          coins={player.coins}
          upgrades={upgrades}
          onBuy={buyItem}
          onBack={goToMap}
        />
      )}

      {screen === "stats" && (
        <StatsScreen
          player={player}
          upgrades={upgrades}
          playerLevel={playerLevel}
          playerXp={playerXp}
          unlockedStage={unlockedStage}
          onBack={goToMap}
        />
      )}

      {screen === "levelcomplete" && completedStage !== null && (
        <LevelCompleteScreen
          level={completedStage}
          stars={earnedStars}
          wasLatest={completedWasLatest}
          onContinue={continueAfterLevelComplete}
        />
      )}

      {screen === "gameover" && (
        <GameOverScreen score={score} onRestart={startGame} />
      )}

      {screen === "reward" && (
        <RewardModal options={rewardOptions} onPick={pickReward} />
      )}

      {screen === "battle" && enemy && currentQuestion && (
        <BattleScreen
          stage={selectedStage}
          player={player}
          enemy={enemy}
          question={currentQuestion}
          lastHit={lastHit}
          floatingMessage={floatingMessage}
          lessonQuestionIndex={lessonQuestionIndex}
          lessonQuestionCount={lessonQuestionCount}
          correctAnswersOnCurrentEnemy={correctAnswersOnCurrentEnemy}
          stageEnemyIndex={stageEnemyIndex}
          stageEnemyCount={stageEnemyCount}
          hintCharges={hintCharges}
          hiddenAnswers={hiddenAnswers}
          onUseHint={useHint}
          onAnswer={answerQuestion}
        />
      )}
    </GameShell>
  );
}
