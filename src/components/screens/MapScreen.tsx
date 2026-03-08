import { loadSave } from "../../features/progression/storage";
import { getRequiredXpForLevel } from "../../features/progression/xp.utils";

type Props = {
  unlockedStage: number;
  selectedStage: number;
  playerLevel: number;
  playerXp: number;
  coins: number;
  onSelectStage: (stage: number) => void;
  onPlay: () => void;
  onShop: () => void;
  onStats: () => void;
};

function getStageStatusText(selectedStage: number, unlockedStage: number) {
  if (selectedStage === unlockedStage) return "Current world stage";
  if (selectedStage < unlockedStage) return "Replay stage to improve stars";
  return "Locked stage";
}

function getStarsText(stars: number) {
  if (stars === 3) return "Perfect run!";
  if (stars === 2) return "Great job!";
  if (stars === 1) return "Completed";
  return "Not completed yet";
}

export function MapScreen({
  unlockedStage,
  selectedStage,
  playerLevel,
  playerXp,
  coins,
  onSelectStage,
  onPlay,
  onShop,
  onStats,
}: Props) {
  const visibleCount = 10;
  const startStage = Math.max(1, selectedStage - 4);
  const nodes = Array.from({ length: visibleCount }, (_, i) => startStage + i);
  const save = loadSave();
  const requiredXp = getRequiredXpForLevel(playerLevel);
  const xpPercent = Math.min(100, (playerXp / requiredXp) * 100);

  const selectedStars = save.stars[selectedStage] ?? 0;
  const isSelectedLocked = selectedStage > unlockedStage;
  const isBossStage = selectedStage % 5 === 0;

  return (
    <div className="flex min-h-screen flex-col gap-6 p-3">
      <div className="rounded-3xl bg-white/10 p-5">
        <div className="text-sm text-white/70">World Map</div>
        <div className="mt-2 text-3xl font-black">Math Quest Kingdom</div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/75">
          <div className="rounded-2xl bg-white/5 p-3">
            <div>Player Level</div>
            <div className="mt-1 text-xl font-black">{playerLevel}</div>
          </div>

          <div className="rounded-2xl bg-white/5 p-3">
            <div>Coins</div>
            <div className="mt-1 text-xl font-black">⭐ {coins}</div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-white/5 p-3">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>XP Progress</span>
            <span>
              {playerXp}/{requiredXp}
            </span>
          </div>

          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-violet-400 transition-all"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white/5 p-4">
        <div className="mb-3 text-sm text-white/60">
          Showing stages {nodes[0]}–{nodes[nodes.length - 1]}
        </div>

        <div className="grid grid-cols-5 gap-3">
          {nodes.map((node) => {
            const isCurrentProgress = node === unlockedStage;
            const isSelected = node === selectedStage;
            const isPassed = node < unlockedStage;
            const isUnlocked = node <= unlockedStage;
            const stars = save.stars[node] ?? 0;
            const boss = node % 5 === 0;

            return (
              <button
                key={node}
                type="button"
                disabled={!isUnlocked}
                onClick={() => onSelectStage(node)}
                className={`flex h-16 items-center justify-center rounded-2xl text-lg font-bold transition ${
                  isSelected
                    ? boss
                      ? "bg-orange-500 text-white ring-4 ring-orange-300/30"
                      : "bg-violet-500 text-white ring-4 ring-violet-300/30"
                    : isCurrentProgress
                      ? boss
                        ? "bg-amber-500 text-white"
                        : "bg-sky-500 text-white"
                      : isPassed
                        ? "bg-emerald-500/80 text-white"
                        : "bg-white/10 text-white/60"
                } ${!isUnlocked ? "opacity-40" : "active:scale-95"}`}
              >
                <div className="flex flex-col items-center leading-tight">
                  <div className="flex items-center gap-1">
                    <span>{node}</span>
                    {boss && <span className="text-xs">👑</span>}
                  </div>
                  <div className="min-h-[16px] text-xs">
                    {"⭐".repeat(stars)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl bg-white/10 p-5 text-center">
        <div className="text-sm text-white/70">Selected Stage</div>
        <div className="mt-2 text-4xl font-black">{selectedStage}</div>

        <div className="mt-4 space-y-2 text-sm text-white/75">
          <div>{getStageStatusText(selectedStage, unlockedStage)}</div>
          <div>{isBossStage ? "Boss stage 👑" : "Normal stage"}</div>
          <div>
            Best stars: {selectedStars > 0 ? "⭐".repeat(selectedStars) : "—"}
          </div>
          <div>{getStarsText(selectedStars)}</div>
        </div>

        <button
          onClick={onPlay}
          disabled={isSelectedLocked}
          className="mt-5 rounded-2xl bg-violet-500 px-6 py-4 text-xl font-bold disabled:opacity-50"
        >
          {selectedStage === unlockedStage
            ? "Play Current Stage"
            : "Replay Stage"}
        </button>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={onShop}
            className="rounded-2xl bg-amber-500 px-6 py-3 text-lg font-bold"
          >
            Open Shop
          </button>

          <button
            onClick={onStats}
            className="rounded-2xl bg-white/10 px-6 py-3 text-lg font-bold hover:bg-white/15"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}
