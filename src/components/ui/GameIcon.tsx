import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-10 w-10",
  xl: "h-14 w-14",
};

export function GameIcon({
  src,
  alt = "",
  size = "md",
  className = "",
  ...props
}: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className={[
        "pointer-events-none select-none object-contain drop-shadow-[0_6px_16px_rgba(15,23,42,0.28)]",
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      draggable={false}
      {...props}
    />
  );
}
