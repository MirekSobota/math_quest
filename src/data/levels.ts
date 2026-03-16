export const MAX_STAGE = 25;

type StageTheme = {
  min: number;
  max: number;
  title: string;
  subtitle: string;
};

const stageThemes: StageTheme[] = [
  {
    min: 1,
    max: 5,
    title: "Enchanted Forest",
    subtitle: "Forest run",
  },
  {
    min: 6,
    max: 10,
    title: "Crystal Cave",
    subtitle: "Cave rush",
  },
  {
    min: 11,
    max: 15,
    title: "Frozen Peaks",
    subtitle: "Ice climb",
  },
  {
    min: 16,
    max: 20,
    title: "Molten Depths",
    subtitle: "Lava dash",
  },
  {
    min: 21,
    max: Number.POSITIVE_INFINITY,
    title: "Shadow Castle",
    subtitle: "Castle finale",
  },
];

function findTheme(stage: number) {
  return (
    stageThemes.find((theme) => stage >= theme.min && stage <= theme.max) ??
    stageThemes[stageThemes.length - 1]
  );
}

export function getStageTheme(stage: number) {
  return findTheme(stage);
}

export function getStageTitle(stage: number) {
  return findTheme(stage).title;
}

export function getStageSubtitle(stage: number) {
  return findTheme(stage).subtitle;
}

export function clampStage(stage: number) {
  return Math.max(1, Math.min(MAX_STAGE, stage));
}
