import { uiIcons } from "../../data/uiAssets";
import { GameIcon } from "../ui/GameIcon";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Screen } from "../layout/Screen";

type Props = {
  onStart: () => void;
  bestScore: number;
};

export function MenuScreen({ onStart, bestScore }: Props) {
  return (
    <Screen className="justify-center">
      <div className="menu-hero-grid grid items-stretch gap-3">
        <Card tone="strong" className="flex flex-col justify-center text-center">
          <div className="menu-logo mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-white/8">
            <span className="text-[2.1rem]">🧮</span>
          </div>

          <h1 className="compact-header-title mt-3 text-4xl font-black md:text-5xl">
            Math Quest
          </h1>

          <div className="compact-copy mt-2 text-base font-semibold text-white/72">
            Tap play and start.
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Card className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-white/8">
              <GameIcon src={uiIcons.reward} alt="Best score" size="lg" />
            </div>
            <div className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-white/60">
              Best score
            </div>
            <div className="mt-1 text-4xl font-black text-white">{bestScore}</div>
          </Card>

          <Button
            onClick={onStart}
            size="lg"
            block
            attention
            className="play-button-main text-[1.45rem] uppercase tracking-[0.24em]"
          >
            <GameIcon src={uiIcons.play} alt="Play" size="md" />
            Play
          </Button>
        </div>
      </div>
    </Screen>
  );
}
