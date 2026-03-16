type Props = {
  text: string;
  visible: boolean;
};

export function FloatingText({ text, visible }: Props) {
  if (!visible || !text) return null;

  return (
    <div className="pointer-events-none absolute left-1/2 top-1 z-20 -translate-x-1/2 rounded-full border border-white/18 bg-slate-950/82 px-3 py-1.5 text-sm font-black text-white shadow-[0_14px_30px_rgba(15,23,42,0.35)] backdrop-blur-sm md:top-3 md:px-4 md:py-2 md:text-base">
      {text}
    </div>
  );
}
