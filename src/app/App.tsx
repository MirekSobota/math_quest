import { useEffect } from "react";
import { GameShell } from "../components/layout/GameShell";
import { MobileLandscapeGuard } from "../components/mobile/MobileLandscapeGuard";
import { RewardModal } from "../components/game/RewardModal";
import { BattleScreen } from "../components/screens/BattleScreen";
import { GameOverScreen } from "../components/screens/GameOverScreen";
import { LevelCompleteScreen } from "../components/screens/LevelCompleteScreen";
import { MapScreen } from "../components/screens/MapScreen";
import { MenuScreen } from "../components/screens/MenuScreen";
import { ShopScreen } from "../components/screens/ShopScreen";
import { StatsScreen } from "../components/screens/StatsScreen";
import {
  preloadGameAssets,
  preloadStageAssets,
} from "../features/assets/preloadGameAssets";
import { useImmersiveMode } from "../features/mobile/useImmersiveMode";
import { useGameStore } from "../store/gameStore";

export default function App() {
  const {
    screen,
    bestScore,
    stars,
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
    stageEnemyIndex,
    stageEnemyCount,
    hintCharges,
    shieldCharges,
    secondChanceCharges,
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

  const {
    isMobile,
    isFullscreen,
    shouldShowRotateOverlay,
    enableImmersiveMode,
  } = useImmersiveMode();

  useEffect(() => {
    void preloadGameAssets();
  }, []);

  useEffect(() => {
    void preloadStageAssets(selectedStage);
  }, [selectedStage]);

  useEffect(() => {
    if (isMobile) {
      void enableImmersiveMode();
    }
  }, [enableImmersiveMode, isMobile, screen]);

  return (
    <>
      <GameShell>
        {screen === "menu" && <MenuScreen onStart={startGame} bestScore={bestScore} />}

        {screen === "map" && (
          <MapScreen
            unlockedStage={unlockedStage}
            selectedStage={selectedStage}
            playerLevel={playerLevel}
            playerXp={playerXp}
            coins={player.coins}
            stars={stars}
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
            bestScore={bestScore}
            stars={stars}
            onBack={goToMap}
          />
        )}

        {screen === "levelcomplete" && completedStage !== null && (
          <LevelCompleteScreen
            key={`${completedStage}-${earnedStars}`}
            level={completedStage}
            stars={earnedStars}
            wasLatest={completedWasLatest}
            onContinue={continueAfterLevelComplete}
          />
        )}

        {screen === "gameover" && (
          <GameOverScreen
            score={score}
            bestScore={bestScore}
            playerLevel={playerLevel}
            unlockedStage={unlockedStage}
            onRestart={startGame}
          />
        )}

        {screen === "reward" && <RewardModal options={rewardOptions} onPick={pickReward} />}

        {screen === "battle" && enemy && currentQuestion && (
          <BattleScreen
            stage={selectedStage}
            player={player}
            enemy={enemy}
            question={currentQuestion}
            lastHit={lastHit}
            floatingMessage={floatingMessage}
            stageEnemyIndex={stageEnemyIndex}
            stageEnemyCount={stageEnemyCount}
            hintCharges={hintCharges}
            shieldCharges={shieldCharges}
            secondChanceCharges={secondChanceCharges}
            hiddenAnswers={hiddenAnswers}
            onUseHint={useHint}
            onAnswer={answerQuestion}
          />
        )}
      </GameShell>

      <MobileLandscapeGuard
        visible={shouldShowRotateOverlay}
        isFullscreen={isFullscreen}
        onEnable={() => {
          void enableImmersiveMode();
        }}
      />
    </>
  );
}
