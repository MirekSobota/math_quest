import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tone?: "violet" | "amber" | "emerald" | "slate";
};

const toneClasses = {
  violet: "bg-violet-500/20 text-violet-100 border-violet-300/20",
  amber: "bg-amber-400/20 text-amber-100 border-amber-300/20",
  emerald: "bg-emerald-500/20 text-emerald-100 border-emerald-300/20",
  slate: "bg-white/10 text-white/80 border-white/10",
};

export function Badge({ children, tone = "slate" }: Props) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        toneClasses[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
