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
      <div className="mx-auto grid w-full max-w-[760px] gap-3">
        <Card tone="strong" className="text-center">
          <div className="menu-logo mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-white/8">
            <span className="text-[2.1rem]">🧮</span>
          </div>

          <h1 className="compact-header-title mt-3 text-4xl font-black md:text-5xl">
            Math Quest
          </h1>

          <div className="compact-copy mt-2 text-base font-semibold text-white/72">
            Tap play to start.
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-sm font-black text-white/90">
            <GameIcon src={uiIcons.reward} alt="Best score" size="sm" />
            Best {bestScore}
          </div>
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
    </Screen>
  );
}
