type Props = {
  onStart: () => void;
  bestScore: number;
};

export function MenuScreen({ onStart, bestScore }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <div className="text-6xl">🧙</div>
      <h1 className="text-4xl font-black">Math Quest</h1>
      <p className="max-w-sm text-white/70">
        Solve math spells, defeat monsters and save the kingdom of numbers.
      </p>
      <div className="rounded-2xl bg-white/10 px-5 py-3 text-lg">
        Best Score: <span className="font-bold">{bestScore}</span>
      </div>
      <button
        onClick={onStart}
        className="rounded-2xl bg-violet-500 px-6 py-4 text-xl font-bold"
      >
        Start Adventure
      </button>
    </div>
  );
}
