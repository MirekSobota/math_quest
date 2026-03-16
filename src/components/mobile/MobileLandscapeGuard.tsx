type Props = {
  visible: boolean;
  isFullscreen: boolean;
  onEnable: () => void;
};

export function MobileLandscapeGuard({
  visible,
  isFullscreen,
  onEnable,
}: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/96 px-6 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-sm flex-col items-center rounded-3xl border border-white/10 bg-white/8 px-6 py-8 text-center shadow-2xl">
        <div className="mb-4 text-6xl">📱↻</div>
        <h2 className="text-2xl font-extrabold tracking-tight">Rotate to landscape</h2>
        <p className="mt-3 text-sm leading-6 text-slate-200/90">
          This game works best in horizontal mode on mobile. Rotate your phone
          and use fullscreen for the cleanest experience.
        </p>

        <button
          type="button"
          onClick={onEnable}
          className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition active:scale-[0.98]"
        >
          {isFullscreen ? "Try landscape again" : "Enable fullscreen"}
        </button>
      </div>
    </div>
  );
}
