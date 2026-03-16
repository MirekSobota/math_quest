import { getStageSubtitle, getStageTitle } from "../../data/levels";
import { uiIcons } from "../../data/uiAssets";
import { getRequiredXpForLevel } from "../../features/progression/xp.utils";
import { GameIcon } from "../ui/GameIcon";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Screen } from "../layout/Screen";

type Props = {
  unlockedStage: number;
  selectedStage: number;
  playerLevel: number;
  playerXp: number;
  coins: number;
  stars: Record<number, number>;
  onSelectStage: (stage: number) => void;
  onPlay: () => void;
  onShop: () => void;
  onStats: () => void;
};

function getStageIcon(selectedStage: number, unlockedStage: number) {
  if (selectedStage > unlockedStage) return "🔒";
  if (selectedStage % 5 === 0) return "👑";
  if (selectedStage === unlockedStage) return "⚡";
  return "⭐";
}

export function MapScreen({
  unlockedStage,
  selectedStage,
  playerLevel,
  playerXp,
  coins,
  stars,
  onSelectStage,
  onPlay,
  onShop,
  onStats,
}: Props) {
  const visibleCount = 10;
  const firstStage = Math.max(1, selectedStage - 4);
  const nodes = Array.from({ length: visibleCount }, (_, i) => firstStage + i);
  const requiredXp = getRequiredXpForLevel(playerLevel);
  const xpPercent = Math.min(100, (playerXp / requiredXp) * 100);

  const selectedStars = stars[selectedStage] ?? 0;
  const isSelectedLocked = selectedStage > unlockedStage;
  const isBossStage = selectedStage % 5 === 0;

  return (
    <Screen className="min-h-0">
      <Card tone="strong">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-3xl bg-white/8 p-3">
              <GameIcon src={uiIcons.map} alt="Map" size="lg" />
            </div>
            <div>
              <div className="text-sm font-bold text-white/70">WORLD</div>
              <div className="compact-header-title mt-1 text-3xl font-black md:text-4xl">
                {getStageTitle(selectedStage)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge tone="slate">🧙 {playerLevel}</Badge>
            <Badge tone="amber">⭐ {coins}</Badge>
            <Badge tone="violet">🚩 {unlockedStage}</Badge>
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-white/70">
            <span>XP</span>
            <span>
              {playerXp}/{requiredXp}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </Card>

      <div className="game-two-pane grid min-h-0 flex-1 gap-3">
        <Card tone="soft" className="flex min-h-0 flex-col">
          <div className="mb-3 flex items-center justify-between text-sm font-bold text-white/70">
            <span>
              {nodes[0]}–{nodes[nodes.length - 1]}
            </span>
            <span>👇</span>
          </div>

          <div className="grid flex-1 grid-cols-5 gap-2 sm:gap-3">
            {nodes.map((node) => {
              const isCurrentProgress = node === unlockedStage;
              const isSelected = node === selectedStage;
              const isPassed = node < unlockedStage;
              const isUnlocked = node <= unlockedStage;
              const stageStars = stars[node] ?? 0;
              const boss = node % 5 === 0;

              return (
                <button
                  key={node}
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => onSelectStage(node)}
                  className={`map-node flex items-center justify-center rounded-2xl text-lg font-bold transition ${
                    isSelected
                      ? boss
                        ? "bg-gradient-to-b from-orange-400 to-rose-500 text-white ring-4 ring-orange-300/35"
                        : "bg-gradient-to-b from-violet-400 to-fuchsia-600 text-white ring-4 ring-violet-300/35"
                      : isCurrentProgress
                        ? boss
                          ? "bg-amber-500 text-white"
                          : "bg-sky-500 text-white"
                        : isPassed
                          ? "bg-emerald-500/85 text-white"
                          : "bg-white/10 text-white/60"
                  } ${!isUnlocked ? "opacity-40" : "active:scale-95"}`}
                >
                  <div className="flex flex-col items-center leading-tight">
                    <div className="flex items-center gap-1">
                      <span>{node}</span>
                      {boss && <span className="text-xs">👑</span>}
                    </div>
                    <div className="min-h-[16px] text-xs">{stageStars > 0 ? "⭐".repeat(stageStars) : "·"}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="flex min-h-0 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-3xl">
                {getStageIcon(selectedStage, unlockedStage)}
              </div>
              <div>
                <div className="text-sm font-bold text-white/65">STAGE {selectedStage}</div>
                <div className="text-2xl font-black leading-tight">{getStageSubtitle(selectedStage)}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm font-black text-white/90">
              <div className="rounded-2xl bg-white/6 p-3">{isBossStage ? "👑 BOSS" : "⚔️ GO"}</div>
              <div className="rounded-2xl bg-white/6 p-3">
                {selectedStars > 0 ? `⭐ ${selectedStars}/3` : "⭐ 0/3"}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={onPlay}
              disabled={isSelectedLocked}
              className="uppercase text-[1.15rem] tracking-[0.22em]"
              size="lg"
              block
              attention
            >
              <GameIcon src={uiIcons.play} alt="Play" size="md" />
              {isSelectedLocked ? "LOCKED" : selectedStage === unlockedStage ? "PLAY" : "REPLAY"}
            </Button>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Button onClick={onShop} variant="warning" size="md">
                <GameIcon src={uiIcons.reward} alt="Shop" size="md" />
                SHOP
              </Button>

              <Button onClick={onStats} variant="secondary" size="md">
                <GameIcon src={uiIcons.heart} alt="Hero" size="md" />
                HERO
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Screen>
  );
}
