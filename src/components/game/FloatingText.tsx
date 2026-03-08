type Props = {
  text: string;
  visible: boolean;
};

export function FloatingText({ text, visible }: Props) {
  if (!visible || !text) return null;

  return (
    <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-white/20 px-4 py-2 text-lg font-bold text-white backdrop-blur-sm">
      {text}
    </div>
  );
}
