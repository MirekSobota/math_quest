import { loadSave } from "../../features/progression/storage";
import { getRequiredXpForLevel } from "../../features/progression/xp.utils";

type Props = {
  player: {
    hp: number;
    maxHp: number;
    coins: number;
    damage: number;
  };
  upgrades: {
    hp: number;
    damage: number;
    hint: number;
  };
  playerLevel: number;
  playerXp: number;
  unlockedStage: number;
  onBack: () => void;
};

function countTotalStars(stars: Record<number, number>) {
  return Object.values(stars).reduce((sum, value) => sum + value, 0);
}

export function StatsScreen({
  player,
  upgrades,
  playerLevel,
  playerXp,
  unlockedStage,
  onBack,
}: Props) {
  const save = loadSave();
  const totalStars = countTotalStars(save.stars);
  const requiredXp = getRequiredXpForLevel(playerLevel);

  return (
    <div className="flex min-h-screen flex-col gap-6 p-3">
      <div className="rounded-3xl bg-white/10 p-5 text-center">
        <h2 className="text-3xl font-black">Hero Profile</h2>
        <div className="mt-2 text-white/70">Your progress and upgrades</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white/10 p-4">
          <div className="text-sm text-white/70">Player Level</div>
          <div className="mt-2 text-3xl font-black">{playerLevel}</div>
        </div>

        <div className="rounded-3xl bg-white/10 p-4">
          <div className="text-sm text-white/70">Unlocked Stage</div>
          <div className="mt-2 text-3xl font-black">{unlockedStage}</div>
        </div>

        <div className="col-span-2 rounded-3xl bg-white/10 p-4">
          <div className="text-sm text-white/70">XP Progress</div>
          <div className="mt-2 text-lg font-bold">
            {playerXp}/{requiredXp}
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-violet-400"
              style={{
                width: `${Math.min(100, (playerXp / requiredXp) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white/10 p-4">
          <div className="text-sm text-white/70">Best Score</div>
          <div className="mt-2 text-3xl font-black">{save.bestScore}</div>
        </div>

        <div className="rounded-3xl bg-white/10 p-4">
          <div className="text-sm text-white/70">Total Stars</div>
          <div className="mt-2 text-3xl font-black">⭐ {totalStars}</div>
        </div>

        <div className="col-span-2 rounded-3xl bg-white/10 p-4">
          <div className="text-sm text-white/70">Coins</div>
          <div className="mt-2 text-3xl font-black">⭐ {player.coins}</div>
        </div>
      </div>

      <div className="rounded-3xl bg-white/10 p-5">
        <div className="text-xl font-bold">Current Stats</div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
            <span className="text-white/70">Hearts</span>
            <span className="font-bold">
              {"❤️".repeat(player.hp)} / {"❤️".repeat(player.maxHp)}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
            <span className="text-white/70">Damage</span>
            <span className="font-bold">⚔️ {player.damage}</span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
            <span className="text-white/70">Hints per Stage</span>
            <span className="font-bold">💡 {upgrades.hint}</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white/10 p-5">
        <div className="text-xl font-bold">Upgrades</div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
            <span className="text-white/70">HP Upgrade</span>
            <span className="font-bold">Lv {upgrades.hp}</span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
            <span className="text-white/70">Damage Upgrade</span>
            <span className="font-bold">Lv {upgrades.damage}</span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
            <span className="text-white/70">Hint Upgrade</span>
            <span className="font-bold">Lv {upgrades.hint}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onBack}
        className="mt-auto rounded-2xl bg-white/10 py-3 font-bold hover:bg-white/15"
      >
        Back
      </button>
    </div>
  );
}
