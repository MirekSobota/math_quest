import { useEffect, useState } from "react";

type Props = {
  level: number;
  stars: number;
  wasLatest: boolean;
  onContinue: () => void;
};

export function LevelCompleteScreen({
  level,
  stars,
  wasLatest,
  onContinue,
}: Props) {
  const [visibleStars, setVisibleStars] = useState(0);

  useEffect(() => {
    setVisibleStars(0);

    let current = 0;
    const interval = window.setInterval(() => {
      current += 1;
      setVisibleStars(current);

      if (current >= stars) {
        window.clearInterval(interval);
      }
    }, 350);

    return () => window.clearInterval(interval);
  }, [stars]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <div className="text-6xl">🏆</div>

      <div>
        <h2 className="text-3xl font-black">Stage Complete!</h2>
        <p className="mt-2 text-white/70">Stage {level}</p>
      </div>

      <div className="rounded-3xl bg-white/10 px-8 py-6">
        <div className="text-sm text-white/70">Stars earned</div>

        <div className="mt-4 flex gap-2 text-5xl">
          {[1, 2, 3].map((star) => {
            const filled = star <= visibleStars;

            return (
              <span
                key={star}
                className={`transition-all duration-300 ${
                  filled ? "scale-110 opacity-100" : "scale-90 opacity-40"
                }`}
              >
                {filled ? "⭐" : "☆"}
              </span>
            );
          })}
        </div>
      </div>

      <button
        onClick={onContinue}
        className="rounded-2xl bg-violet-500 px-6 py-4 text-xl font-bold"
      >
        {wasLatest ? "Continue" : "Back to Map"}
      </button>
    </div>
  );
}
