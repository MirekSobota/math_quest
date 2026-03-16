import type { ReactNode } from "react";
import { useGameStore } from "../../store/gameStore";

import forest from "../../assets/images/backgrounds/forest.png";
import cave from "../../assets/images/backgrounds/cave.png";
import ice from "../../assets/images/backgrounds/ice.png";
import lava from "../../assets/images/backgrounds/lava.png";
import castle from "../../assets/images/backgrounds/castle.png";

type Props = {
  children: ReactNode;
};

function getBackground(stage: number) {
  if (stage <= 5) return forest;
  if (stage <= 10) return cave;
  if (stage <= 15) return ice;
  if (stage <= 20) return lava;
  return castle;
}

export function GameShell({ children }: Props) {
  const selectedStage = useGameStore((state) => state.selectedStage);
  const background = getBackground(selectedStage);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden text-white">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${background})` }} />

      <div className="absolute inset-0 bg-slate-950/58" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/68 via-slate-900/34 to-slate-950/72" />

      <div
        className="app-wide-shell relative mx-auto flex h-[100dvh] w-full"
        style={{
          paddingTop: "max(6px, env(safe-area-inset-top))",
          paddingBottom: "max(6px, env(safe-area-inset-bottom))",
          paddingLeft: "max(6px, env(safe-area-inset-left))",
          paddingRight: "max(6px, env(safe-area-inset-right))",
        }}
      >
        <div className="flex h-full min-h-0 w-full flex-1">{children}</div>
      </div>
    </div>
  );
}
