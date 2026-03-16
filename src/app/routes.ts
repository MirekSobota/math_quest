import type { GameScreen } from "../types/game";

export const GAME_ROUTE_ORDER: GameScreen[] = [
  "menu",
  "map",
  "battle",
  "reward",
  "levelcomplete",
  "shop",
  "stats",
  "gameover",
];

export const OVERLAY_SCREENS: GameScreen[] = ["reward"];
