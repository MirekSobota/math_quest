import { uiIcons } from "../../data/uiAssets";
import { getUpgradeMax, getUpgradePrice } from "../../features/shop/shop.utils";
import { GameIcon } from "../ui/GameIcon";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Screen } from "../layout/Screen";

type UpgradeState = {
  hp: number;
  damage: number;
  hint: number;
};

type ShopItemId = "hp" | "damage" | "hint";

type Props = {
  coins: number;
  upgrades: UpgradeState;
  onBuy: (id: ShopItemId) => void;
  onBack: () => void;
};

type ShopItem = {
  id: ShopItemId;
  title: string;
  badge: string;
  icon: string;
  basePrice: number;
};

const items: ShopItem[] = [
  {
    id: "hp",
    title: "Hearts",
    badge: "+1 HP",
    icon: uiIcons.heart,
    basePrice: 40,
  },
  {
    id: "damage",
    title: "Attack",
    badge: "+1 DMG",
    icon: uiIcons.attack,
    basePrice: 60,
  },
  {
    id: "hint",
    title: "Hints",
    badge: "+1",
    icon: uiIcons.hint,
    basePrice: 55,
  },
];

function renderLevelDots(level: number, max: number) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`h-2.5 w-2.5 rounded-full ${i < level ? "bg-violet-400" : "bg-white/15"}`} />
      ))}
    </div>
  );
}

export function ShopScreen({ coins, upgrades, onBuy, onBack }: Props) {
  return (
    <Screen>
      <Card tone="strong">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-white/8 p-3">
              <GameIcon src={uiIcons.reward} alt="Shop" size="lg" />
            </div>
            <h2 className="compact-header-title text-3xl font-black md:text-4xl">Shop</h2>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-lg font-bold">⭐ {coins}</div>
        </div>
      </Card>

      <div className="shop-grid grid gap-3">
        {items.map((item) => {
          const currentLevel = upgrades[item.id];
          const maxLevel = getUpgradeMax(item.id);
          const isMax = currentLevel >= maxLevel;
          const price = getUpgradePrice(item.basePrice, currentLevel);
          const canBuy = !isMax && coins >= price;

          return (
            <Card key={item.id} className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-3xl bg-white/8 p-2.5">
                    <GameIcon src={item.icon} alt={item.title} size="lg" />
                  </div>
                  <div>
                    <div className="text-xl font-black">{item.title}</div>
                    <div className="mt-1 text-sm font-bold text-white/75">{item.badge}</div>
                  </div>
                </div>

                <div className="rounded-xl bg-white/10 px-3 py-1 text-sm font-bold">Lv {currentLevel}/{maxLevel}</div>
              </div>

              <div className="mt-4">{renderLevelDots(currentLevel, maxLevel)}</div>

              <div className="mt-4 flex flex-1 items-end justify-between gap-4">
                <div className="compact-copy text-base font-black text-white/90">
                  {isMax ? <span className="text-emerald-300">MAX</span> : <span>⭐ {price}</span>}
                </div>

                <Button
                  onClick={() => onBuy(item.id)}
                  disabled={!canBuy}
                  variant={canBuy ? "primary" : "secondary"}
                  size="sm"
                  attention={canBuy}
                >
                  {isMax ? "MAX" : "BUY"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Button onClick={onBack} variant="secondary" size="md" block>
        ⬅ BACK
      </Button>
    </Screen>
  );
}
