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
  requiredCorrectAnswers: number;
  xpReward: number;
};

export type Player = {
  hp: number;
  maxHp: number;
  energy: number;
  coins: number;
  streak: number;
  damage: number;
};

export type UpgradeAccent = "emerald" | "rose" | "amber" | "violet";

export type Upgrade = {
  id: string;
  title: string;
  description: string;
  type: "heal" | "damage" | "coins";
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
    damage: number;
    hint: number;
  };
  player: Pick<Player, "hp" | "maxHp" | "coins" | "damage">;
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
  activeSpell: SpellTier;

  mistakes: number;

  earnedStars: number;
  completedStage: number | null;
  completedWasLatest: boolean;

  correctAnswersOnCurrentEnemy: number;

  stageEnemyIndex: number;
  stageEnemyCount: number;

  lessonQuestionIndex: number;
  lessonQuestionCount: number;

  recentQuestionKeys: string[];
  hintCharges: number;
  hiddenAnswers: number[];
};
