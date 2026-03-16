import { useEffect, useState } from "react";
import { uiIcons } from "../../data/uiAssets";
import { GameIcon } from "../ui/GameIcon";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Screen } from "../layout/Screen";

type Props = {
  level: number;
  stars: number;
  wasLatest: boolean;
  onContinue: () => void;
};

export function LevelCompleteScreen({ level, stars, wasLatest, onContinue }: Props) {
  const [visibleStars, setVisibleStars] = useState(0);

  useEffect(() => {
    let current = 0;
    let timeoutId: number | null = null;

    const revealNext = () => {
      current += 1;
      setVisibleStars(current);

      if (current < stars) {
        timeoutId = window.setTimeout(revealNext, 280);
      }
    };

    timeoutId = window.setTimeout(revealNext, 220);

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [stars]);

  return (
    <Screen className="justify-center">
      <div className="menu-hero-grid grid items-center gap-3">
        <Card tone="strong" className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/8">
            <GameIcon src={uiIcons.reward} alt="Reward" size="xl" />
          </div>
          <div>
            <h2 className="compact-header-title text-3xl font-black md:text-4xl">Stage {level}</h2>
            <p className="compact-copy mt-2 text-white/80">Clear!</p>
          </div>

          <div className="rounded-3xl bg-white/5 px-6 py-5">
            <div className="mt-2 flex justify-center gap-2 text-5xl">
              {[1, 2, 3].map((star) => {
                const filled = star <= visibleStars;

                return (
                  <span
                    key={star}
                    className={`transition-all duration-300 ${
                      filled ? "scale-100 opacity-100" : "scale-75 opacity-35"
                    }`}
                  >
                    ⭐
                  </span>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Card tone="soft" className="grid grid-cols-3 gap-2 text-center text-sm font-bold text-white/90">
            <div className="rounded-2xl bg-white/6 p-3">
              <GameIcon src={uiIcons.reward} alt="Stars" size="lg" className="mx-auto" />
            </div>
            <div className="rounded-2xl bg-white/6 p-3">
              <GameIcon src={uiIcons.play} alt="Next" size="lg" className="mx-auto" />
            </div>
            <div className="rounded-2xl bg-white/6 p-3">
              <GameIcon src={uiIcons.map} alt="Map" size="lg" className="mx-auto" />
            </div>
          </Card>

          <Button onClick={onContinue} size="lg" block attention className="uppercase tracking-[0.22em]">
            <GameIcon src={wasLatest ? uiIcons.play : uiIcons.map} alt="Continue" size="md" />
            {wasLatest ? "NEXT" : "MAP"}
          </Button>
        </div>
      </div>
    </Screen>
  );
}
