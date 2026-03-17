import type { Upgrade } from "../../types/game";
import { uiIcons } from "../../data/uiAssets";
import { GameIcon } from "../ui/GameIcon";
import { Card } from "../ui/Card";

type Props = {
  options: Upgrade[];
  onPick: (upgrade: Upgrade) => void;
};

const accentClasses = {
  emerald: "from-emerald-300/28 via-emerald-400/18 to-emerald-600/12 border-emerald-300/36",
  rose: "from-rose-300/28 via-rose-400/18 to-rose-600/12 border-rose-300/36",
  amber: "from-amber-300/28 via-amber-400/18 to-amber-600/12 border-amber-300/36",
  violet: "from-violet-300/28 via-violet-400/18 to-fuchsia-600/12 border-violet-300/36",
  slate: "from-slate-200/18 via-slate-300/12 to-slate-500/8 border-white/18",
};

export function RewardModal({ options, onPick }: Props) {
  return (
    <div className="app-scrollable-screen flex min-h-[100dvh] w-full flex-col justify-center gap-4 p-3 md:p-4">
      <Card tone="strong" className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/8">
          <GameIcon src={uiIcons.reward} alt="Reward" size="xl" />
        </div>
        <div className="mt-2 text-3xl font-black md:text-4xl">Pick 1</div>
      </Card>

      <div className="reward-grid grid gap-4">
        {options.map((option) => {
          const accent = accentClasses[option.accent ?? "violet"];

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onPick(option)}
              className="group text-left"
            >
              <Card
                className={`reward-choice btn-attention flex h-full flex-col gap-4 border-2 bg-gradient-to-b ${accent}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-3xl bg-white/10 px-4 py-3">
                    <GameIcon src={option.icon ?? uiIcons.reward} alt={option.title} size="xl" />
                  </div>
                  <div className="rounded-full bg-white/14 px-3 py-1 text-sm font-black text-white/95">
                    {option.shortLabel ?? option.description}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-black text-white">{option.title}</div>
                  <div className="mt-2 text-lg font-black text-white/92">{option.description}</div>
                </div>

                <div className="mt-auto rounded-2xl bg-white/14 px-4 py-3 text-center text-lg font-black tracking-[0.16em] text-white">
                  TAKE
                </div>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
