export type GameScreen =
  | "menu"
  | "map"
  | "battle"
  | "reward"
  | "gameover"
  | "levelcomplete"
  | "shop"
  | "stats";

export type QuestionKind = "addition" | "subtraction" | "multiplication";

export type SpellTier = "none" | "fireball" | "lightning" | "mega";

export type Question = {
  id: string;
  text: string;
  answers: number[];
  correctAnswer: number;
  kind: QuestionKind;
  key: string;
};

export type Enemy = {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  emoji: string;
  isBoss?: boolean;
  xpReward: number;
};

export type Player = {
  hp: number;
  maxHp: number;
  coins: number;
};

export type UpgradeAccent = "emerald" | "rose" | "amber" | "violet" | "slate";

export type Upgrade = {
  id: string;
  title: string;
  description: string;
  type: "heart" | "hint" | "shield" | "secondChance" | "starBonus" | "coins";
  value: number;
  icon?: string;
  shortLabel?: string;
  accent?: UpgradeAccent;
};

export type SaveData = {
  bestScore: number;
  playerLevel: number;
  playerXp: number;
  unlockedStage: number;
  stars: Record<number, number>;
  upgrades: {
    hp: number;
    hint: number;
    shield: number;
    secondChance: number;
    starBonus: number;
  };
  player: Pick<Player, "hp" | "maxHp" | "coins">;
};

export type GameState = {
  screen: GameScreen;

  bestScore: number;
  stars: Record<number, number>;

  playerLevel: number;
  playerXp: number;

  unlockedStage: number;
  selectedStage: number;

  score: number;

  player: Player;
  enemy: Enemy | null;
  currentQuestion: Question | null;
  rewardOptions: Upgrade[];

  lastHit: "correct" | "wrong" | null;

  mistakes: number;

  earnedStars: number;
  completedStage: number | null;
  completedWasLatest: boolean;

  stageEnemyIndex: number;
  stageEnemyCount: number;

  lessonQuestionIndex: number;
  lessonQuestionCount: number;

  recentQuestionKeys: string[];
  hintCharges: number;
  shieldCharges: number;
  secondChanceCharges: number;
  hiddenAnswers: number[];
};
