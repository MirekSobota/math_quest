import { getUpgradeMax, getUpgradePrice } from "../../features/shop/shop.utils";

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
  description: string;
  icon: string;
  basePrice: number;
};

const items: ShopItem[] = [
  {
    id: "hp",
    title: "Max HP",
    description: "Increase your maximum hearts by 1",
    icon: "❤️",
    basePrice: 40,
  },
  {
    id: "damage",
    title: "Damage",
    description: "Increase your attack damage by 1",
    icon: "⚔️",
    basePrice: 60,
  },
  {
    id: "hint",
    title: "Hint",
    description: "Start each stage with more hint uses",
    icon: "💡",
    basePrice: 55,
  },
];

function renderLevelDots(level: number, max: number) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full ${
            i < level ? "bg-violet-400" : "bg-white/15"
          }`}
        />
      ))}
    </div>
  );
}

export function ShopScreen({ coins, upgrades, onBuy, onBack }: Props) {
  return (
    <div className="flex min-h-screen flex-col gap-6 p-3">
      <div className="rounded-3xl bg-white/10 p-5 text-center">
        <h2 className="text-3xl font-black">Shop</h2>
        <div className="mt-2 text-white/70">Coins: ⭐ {coins}</div>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const currentLevel = upgrades[item.id];
          const maxLevel = getUpgradeMax(item.id);
          const isMax = currentLevel >= maxLevel;
          const price = getUpgradePrice(item.basePrice, currentLevel);
          const canBuy = !isMax && coins >= price;

          return (
            <div key={item.id} className="rounded-3xl bg-white/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="text-xl font-bold">{item.title}</div>
                  </div>

                  <div className="mt-2 text-sm text-white/70">
                    {item.description}
                  </div>
                </div>

                <div className="rounded-xl bg-white/10 px-3 py-1 text-sm font-bold">
                  Lv {currentLevel}/{maxLevel}
                </div>
              </div>

              <div className="mt-4">
                {renderLevelDots(currentLevel, maxLevel)}
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="text-sm text-white/75">
                  {isMax ? (
                    <span className="font-bold text-emerald-300">
                      MAX level reached
                    </span>
                  ) : (
                    <span>
                      Next upgrade cost:{" "}
                      <span className="font-bold">⭐ {price}</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onBuy(item.id)}
                  disabled={!canBuy}
                  className={`rounded-2xl px-4 py-2 font-bold transition ${
                    canBuy
                      ? "bg-violet-500 hover:bg-violet-400 active:scale-95"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {isMax ? "MAX" : "Buy"}
                </button>
              </div>
            </div>
          );
        })}
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
