export function getStarsForMistakes(mistakes: number) {
  if (mistakes <= 0) return 3;
  if (mistakes === 1) return 2;
  return 1;
}

export function shouldOfferRewardForStage(
  completedStage: number | null,
  completedWasLatest: boolean,
) {
  if (!completedWasLatest || !completedStage) {
    return false;
  }

  return completedStage % 3 === 0;
}
