import { loadSave } from "../../features/progression/storage";

type Props = {
  score: number;
  onRestart: () => void;
};

export function GameOverScreen({ score, onRestart }: Props) {
  const { bestScore, playerLevel, unlockedStage } = loadSave();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <div className="text-6xl">💀</div>

      <h2 className="text-3xl font-black">Game Over</h2>

      <p className="text-white/70">Score: {score}</p>
      <p className="text-white/70">Best Score: {bestScore}</p>
      <p className="text-white/70">Player Level: {playerLevel}</p>
      <p className="text-white/70">Unlocked Stage: {unlockedStage}</p>

      <button
        onClick={onRestart}
        className="rounded-2xl bg-fuchsia-500 px-6 py-4 text-xl font-bold"
      >
        Back to Map
      </button>
    </div>
  );
}
