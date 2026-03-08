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
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      />

      <div className="absolute inset-0 bg-slate-950/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-900/25 to-slate-950/55" />

      <div
        className="relative mx-auto w-full max-w-md"
        style={{
          minHeight: "100dvh",
          paddingTop: "max(10px, env(safe-area-inset-top))",
          paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
