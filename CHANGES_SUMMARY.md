# Sprint 1 + Sprint 2

## Sprint 1
- fixed mobile map flow so the stage start button stays visible
- rebuilt the map screen layout for landscape phones
- simplified the start screen
- removed DMG and Hits from gameplay and UI
- rebuilt battle UI around one clear enemy HP system
- boss stages are now boss-only stages

## Sprint 2
- new permanent upgrades in shop and rewards:
  - Heart
  - Hint
  - Shield
  - Second Chance
  - Star Bonus
- Shield blocks a wrong answer without losing a heart
- Second Chance revives the player with 1 heart
- Star Bonus adds +1 stage star, capped at 3

## Audio
- boss win track stays connected
- uploaded `lose.mp3` is now used on game over

## Main files changed
- `src/store/gameStore.ts`
- `src/components/screens/MapScreen.tsx`
- `src/components/screens/BattleScreen.tsx`
- `src/components/screens/MenuScreen.tsx`
- `src/components/screens/ShopScreen.tsx`
- `src/components/screens/StatsScreen.tsx`
- `src/components/game/ProgressHud.tsx`
- `src/components/game/BattleScene.tsx`
- `src/features/battle/stage.utils.ts`
- `src/features/battle/battle.utils.ts`
- `src/features/progression/storage.ts`
- `src/features/audio/sounds.ts`
- `src/data/rewards.ts`
- `src/features/shop/shop.utils.ts`
- `src/types/game.ts`
- `src/index.css`
