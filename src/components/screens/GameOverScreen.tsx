import { uiIcons } from "../../data/uiAssets";
import { GameIcon } from "../ui/GameIcon";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Screen } from "../layout/Screen";

type Props = {
  score: number;
  bestScore: number;
  playerLevel: number;
  unlockedStage: number;
  onRestart: () => void;
};

export function GameOverScreen({ score, bestScore, playerLevel, unlockedStage, onRestart }: Props) {
  return (
    <Screen className="justify-center">
      <div className="menu-hero-grid grid items-center gap-3">
        <Card tone="strong" className="text-center">
          <div className="text-6xl">💀</div>
          <h2 className="compact-header-title mt-3 text-3xl font-black md:text-4xl">Try again</h2>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-white/85">
            <div className="rounded-2xl bg-white/5 p-3">
              <GameIcon src={uiIcons.reward} alt="Score" size="lg" className="mx-auto" />
              <div className="mt-1 text-xl font-black text-white">{score}</div>
            </div>
            <div className="rounded-2xl bg-white/5 p-3">
              <div className="text-2xl">⭐</div>
              <div className="mt-1 text-xl font-black text-white">{bestScore}</div>
            </div>
            <div className="rounded-2xl bg-white/5 p-3">
              <GameIcon src={uiIcons.heart} alt="Level" size="lg" className="mx-auto" />
              <div className="mt-1 text-xl font-black text-white">{playerLevel}</div>
            </div>
            <div className="rounded-2xl bg-white/5 p-3">
              <GameIcon src={uiIcons.map} alt="Stage" size="lg" className="mx-auto" />
              <div className="mt-1 text-xl font-black text-white">{unlockedStage}</div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Card tone="soft" className="grid grid-cols-3 gap-2 text-center text-sm font-bold text-white/90">
            <div className="rounded-2xl bg-white/6 p-3">
              <GameIcon src={uiIcons.hint} alt="Hint" size="lg" className="mx-auto" />
            </div>
            <div className="rounded-2xl bg-white/6 p-3">
              <GameIcon src={uiIcons.attack} alt="Attack" size="lg" className="mx-auto" />
            </div>
            <div className="rounded-2xl bg-white/6 p-3">
              <GameIcon src={uiIcons.play} alt="Play" size="lg" className="mx-auto" />
            </div>
          </Card>

          <Button onClick={onRestart} size="lg" block attention className="uppercase tracking-[0.22em]">
            <GameIcon src={uiIcons.map} alt="Map" size="md" />
            MAP
          </Button>
        </div>
      </div>
    </Screen>
  );
}
