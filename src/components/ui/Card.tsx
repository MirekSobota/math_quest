import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tone?: "default" | "soft" | "strong";
};

const toneClasses = {
  default: "bg-slate-900/58 shadow-[0_12px_36px_rgba(15,23,42,0.18)]",
  soft: "bg-slate-900/46 shadow-[0_10px_30px_rgba(15,23,42,0.14)]",
  strong: "bg-slate-900/68 shadow-[0_18px_44px_rgba(15,23,42,0.28)]",
};

export function Card({
  children,
  className = "",
  tone = "default",
  ...props
}: Props) {
  return (
    <div
      className={[
        "card-surface relative rounded-3xl border border-white/12 backdrop-blur-md overflow-hidden",
        toneClasses[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
