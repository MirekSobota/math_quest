import type { Upgrade } from "../../types/game";

type Props = {
  options: Upgrade[];
  onPick: (upgrade: Upgrade) => void;
};

export function RewardModal({ options, onPick }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl bg-white/10 p-5 text-center">
        <div className="text-2xl font-black">Choose Reward</div>
        <p className="mt-2 text-white/70">Great job! Pick one upgrade.</p>
      </div>

      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onPick(option)}
          className="rounded-3xl bg-white/10 p-5 text-left transition active:scale-95"
        >
          <div className="text-xl font-bold">{option.title}</div>
          <div className="mt-1 text-white/70">{option.description}</div>
        </button>
      ))}
    </div>
  );
}
