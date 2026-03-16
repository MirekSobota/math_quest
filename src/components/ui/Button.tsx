import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "warning";
type ButtonSize = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  attention?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-violet-200/30 bg-gradient-to-b from-fuchsia-400 via-violet-500 to-purple-700 text-white shadow-[0_12px_34px_rgba(168,85,247,0.38)] hover:brightness-110 disabled:from-violet-500/70 disabled:to-fuchsia-600/70",
  secondary:
    "border border-white/14 bg-white/12 text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] hover:bg-white/18 disabled:bg-white/10",
  ghost:
    "border border-transparent bg-transparent text-white hover:bg-white/10 disabled:text-white/50",
  warning:
    "border border-amber-100/36 bg-gradient-to-b from-amber-300 via-yellow-400 to-yellow-500 text-slate-950 shadow-[0_12px_30px_rgba(250,204,21,0.36)] hover:brightness-105 disabled:from-amber-300/70 disabled:to-yellow-500/70",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2.5 text-sm",
  md: "min-h-12 px-5 py-3 text-base",
  lg: "min-h-16 px-6 py-4 text-lg",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  block = false,
  attention = false,
  type = "button",
  ...props
}: Props) {
  const classes = [
    "button-core relative overflow-hidden rounded-3xl font-black tracking-wide transition duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    block ? "w-full" : "",
    attention ? "btn-attention kid-cta" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}
