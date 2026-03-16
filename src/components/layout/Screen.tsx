import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Screen({ children, className = "" }: Props) {
  return (
    <div
      className={[
        "screen-shell app-scrollable-screen flex h-full min-h-0 w-full flex-col",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
