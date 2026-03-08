export type QuestionStage =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "mixed";

export function getQuestionStage(level: number): QuestionStage {
  if (level <= 5) return "addition";
  if (level <= 10) return "subtraction";
  if (level <= 15) return "multiplication";
  return "mixed";
}
