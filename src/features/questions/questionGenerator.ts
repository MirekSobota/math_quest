import type { Question, QuestionKind } from "../../types/game";
import { getQuestionStage } from "./questionTypes";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function buildAnswers(correct: number, count: number): number[] {
  const answers = new Set<number>();
  answers.add(correct);

  while (answers.size < count) {
    const offset = randomInt(1, 6);
    const direction = Math.random() < 0.5 ? -1 : 1;
    const wrong = Math.max(0, correct + offset * direction);
    answers.add(wrong);
  }

  return shuffleArray(Array.from(answers));
}

function createAddition(level: number, answerCount: number): Question {
  const max = level <= 5 ? 10 : level <= 20 ? 20 : 30;
  const a = randomInt(1, max);
  const b = randomInt(1, max);
  const correct = a + b;

  return {
    id: crypto.randomUUID(),
    text: `${a} + ${b} = ?`,
    answers: buildAnswers(correct, answerCount),
    correctAnswer: correct,
    kind: "addition",
    key: `add-${a}-${b}`,
  };
}

function createSubtraction(level: number, answerCount: number): Question {
  const max = level <= 10 ? 20 : 40;
  const a = randomInt(6, max);
  const b = randomInt(1, a - 1);
  const correct = a - b;

  return {
    id: crypto.randomUUID(),
    text: `${a} - ${b} = ?`,
    answers: buildAnswers(correct, answerCount),
    correctAnswer: correct,
    kind: "subtraction",
    key: `sub-${a}-${b}`,
  };
}

function createMultiplication(level: number, answerCount: number): Question {
  const maxFactor = level <= 15 ? 6 : 10;
  const a = randomInt(2, maxFactor);
  const b = randomInt(2, maxFactor);
  const correct = a * b;

  return {
    id: crypto.randomUUID(),
    text: `${a} × ${b} = ?`,
    answers: buildAnswers(correct, answerCount),
    correctAnswer: correct,
    kind: "multiplication",
    key: `mul-${a}-${b}`,
  };
}

function generateRawQuestion(level: number, answerCount: number): Question {
  const stage = getQuestionStage(level);

  if (stage === "addition") return createAddition(level, answerCount);
  if (stage === "subtraction") return createSubtraction(level, answerCount);
  if (stage === "multiplication")
    return createMultiplication(level, answerCount);

  const pool: QuestionKind[] = ["addition", "subtraction", "multiplication"];
  const kind = pool[randomInt(0, pool.length - 1)];

  if (kind === "addition") return createAddition(level, answerCount);
  if (kind === "subtraction") return createSubtraction(level, answerCount);
  return createMultiplication(level, answerCount);
}

export function generateQuestion(
  level: number,
  answerCount = 4,
  recentQuestionKeys: string[] = [],
): Question {
  for (let i = 0; i < 20; i += 1) {
    const question = generateRawQuestion(level, answerCount);
    if (!recentQuestionKeys.includes(question.key)) {
      return question;
    }
  }

  return generateRawQuestion(level, answerCount);
}
