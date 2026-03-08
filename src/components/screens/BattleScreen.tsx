import { ProgressHud } from "../game/ProgressHud";
import { BattleScene } from "../game/BattleScene";
import { QuestionCard } from "../game/QuestionCard";
import { AnswerButtons } from "../game/AnswerButtons";
import { FloatingText } from "../game/FloatingText";
import type { Enemy, Player, Question } from "../../types/game";

type Props = {
  stage: number;
  player: Player;
  enemy: Enemy;
  question: Question;
  lastHit: "correct" | "wrong" | null;
  floatingMessage: string;
  lessonQuestionIndex: number;
  lessonQuestionCount: number;
  correctAnswersOnCurrentEnemy: number;
  stageEnemyIndex: number;
  stageEnemyCount: number;
  hintCharges: number;
  hiddenAnswers: number[];
  onUseHint: () => void;
  onAnswer: (answer: number) => void;
};

export function BattleScreen({
  stage,
  player,
  enemy,
  question,
  lastHit,
  floatingMessage,
  lessonQuestionIndex,
  lessonQuestionCount,
  correctAnswersOnCurrentEnemy,
  stageEnemyIndex,
  stageEnemyCount,
  hintCharges,
  hiddenAnswers,
  onUseHint,
  onAnswer,
}: Props) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden px-3 pb-2">
      <FloatingText text={floatingMessage} visible={!!floatingMessage} />

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="shrink-0">
          <div className="rounded-2xl bg-white/10 px-3 py-2 text-center">
            <div className="text-[11px] text-white/70">
              {enemy.isBoss ? "Boss Stage" : "World Stage"}
            </div>
            <div className="text-xl font-black leading-none">{stage}</div>
            <div className="mt-1 text-xs text-white/70">
              Enemy {stageEnemyIndex}/{stageEnemyCount}
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <ProgressHud
            stage={stage}
            lessonQuestionIndex={lessonQuestionIndex}
            lessonQuestionCount={lessonQuestionCount}
            playerHp={player.hp}
          />
        </div>

        <div className="shrink-0">
          <BattleScene
            enemy={enemy}
            lastHit={lastHit}
            correctAnswersOnCurrentEnemy={correctAnswersOnCurrentEnemy}
          />
        </div>

        <div className="shrink-0">
          <QuestionCard text={question.text} />
        </div>

        <div className="shrink-0 rounded-2xl bg-white/10 px-3 py-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span>Hints left: {hintCharges}</span>
            <button
              onClick={onUseHint}
              disabled={hintCharges <= 0}
              className="rounded-xl bg-amber-400 px-3 py-1.5 text-sm font-bold text-slate-900 disabled:opacity-40"
            >
              Use Hint
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <AnswerButtons
            answers={question.answers}
            hiddenAnswers={hiddenAnswers}
            onAnswer={onAnswer}
          />
        </div>
      </div>
    </div>
  );
}
