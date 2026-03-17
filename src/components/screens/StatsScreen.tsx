import { uiIcons } from "../../data/uiAssets";
import { getRequiredXpForLevel } from "../../features/progression/xp.utils";
import { GameIcon } from "../ui/GameIcon";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Screen } from "../layout/Screen";

type Props = {
  player: {
    hp: number;
    maxHp: number;
    coins: number;
  };
  upgrades: {
    hp: number;
    hint: number;
    shield: number;
    secondChance: number;
    starBonus: number;
  };
  playerLevel: number;
  playerXp: number;
  unlockedStage: number;
  bestScore: number;
  stars: Record<number, number>;
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
  bestScore,
  stars,
  onBack,
}: Props) {
  const totalStars = countTotalStars(stars);
  const requiredXp = getRequiredXpForLevel(playerLevel);

  return (
    <Screen>
      <Card tone="strong">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-white/8 p-3">
              <GameIcon src={uiIcons.heart} alt="Hero" size="lg" />
            </div>
            <h2 className="compact-header-title text-3xl font-black md:text-4xl">Hero</h2>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-lg font-bold">⭐ {player.coins}</div>
        </div>
      </Card>

      <div className="stats-layout grid gap-3">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Card>
              <div className="text-sm text-white/70">Lv</div>
              <div className="mt-2 text-3xl font-black">{playerLevel}</div>
            </Card>

            <Card>
              <div className="text-sm text-white/70">Stage</div>
              <div className="mt-2 text-3xl font-black">{unlockedStage}</div>
            </Card>

            <Card>
              <div className="text-sm text-white/70">Best</div>
              <div className="mt-2 text-3xl font-black">{bestScore}</div>
            </Card>

            <Card>
              <div className="text-sm text-white/70">Stars</div>
              <div className="mt-2 text-3xl font-black">{totalStars}</div>
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>XP</span>
              <span>
                {playerXp}/{requiredXp}
              </span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500"
                style={{ width: `${Math.min(100, (playerXp / requiredXp) * 100)}%` }}
              />
            </div>
          </Card>

          <Card>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <div className="rounded-2xl bg-white/5 p-4 text-center">
                <GameIcon src={uiIcons.heart} alt="HP" size="lg" className="mx-auto" />
                <div className="mt-2 font-bold">
                  {player.hp}/{player.maxHp}
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 text-center">
                <GameIcon src={uiIcons.hint} alt="Hints" size="lg" className="mx-auto" />
                <div className="mt-2 font-bold">{upgrades.hint}</div>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 text-center">
                <GameIcon src={uiIcons.attack} alt="Shield" size="lg" className="mx-auto" />
                <div className="mt-2 font-bold">{upgrades.shield}</div>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 text-center">
                <GameIcon src={uiIcons.play} alt="Second chance" size="lg" className="mx-auto" />
                <div className="mt-2 font-bold">{upgrades.secondChance}</div>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 text-center">
                <GameIcon src={uiIcons.reward} alt="Star bonus" size="lg" className="mx-auto" />
                <div className="mt-2 font-bold">{upgrades.starBonus}</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Card>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <GameIcon src={uiIcons.heart} alt="Hearts" size="md" />
                  <span className="font-bold text-white/75">Hearts</span>
                </div>
                <span className="font-black">Lv {upgrades.hp}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <GameIcon src={uiIcons.hint} alt="Hints" size="md" />
                  <span className="font-bold text-white/75">Hints</span>
                </div>
                <span className="font-black">Lv {upgrades.hint}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <GameIcon src={uiIcons.attack} alt="Shield" size="md" />
                  <span className="font-bold text-white/75">Shield</span>
                </div>
                <span className="font-black">Lv {upgrades.shield}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <GameIcon src={uiIcons.play} alt="Second chance" size="md" />
                  <span className="font-bold text-white/75">Second chance</span>
                </div>
                <span className="font-black">Lv {upgrades.secondChance}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <GameIcon src={uiIcons.reward} alt="Star bonus" size="md" />
                  <span className="font-bold text-white/75">Star bonus</span>
                </div>
                <span className="font-black">Lv {upgrades.starBonus}</span>
              </div>
            </div>
          </Card>

          <Button onClick={onBack} variant="secondary" size="md" block>
            ⬅ BACK
          </Button>
        </div>
      </div>
    </Screen>
  );
}
