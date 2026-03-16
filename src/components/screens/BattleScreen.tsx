import { uiIcons } from "../../data/uiAssets";
import { ProgressHud } from "../game/ProgressHud";
import { BattleScene } from "../game/BattleScene";
import { QuestionCard } from "../game/QuestionCard";
import { AnswerButtons } from "../game/AnswerButtons";
import { FloatingText } from "../game/FloatingText";
import { GameIcon } from "../ui/GameIcon";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import type { Enemy, Player, Question, SpellTier } from "../../types/game";

type Props = {
  stage: number;
  player: Player;
  enemy: Enemy;
  question: Question;
  activeSpell: SpellTier;
  lastHit: "correct" | "wrong" | null;
  floatingMessage: string;
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
  activeSpell,
  lastHit,
  floatingMessage,
  correctAnswersOnCurrentEnemy,
  stageEnemyIndex,
  stageEnemyCount,
  hintCharges,
  hiddenAnswers,
  onUseHint,
  onAnswer,
}: Props) {
  return (
    <div className="battle-screen relative flex h-full min-h-0 w-full flex-col gap-2 p-1.5 md:gap-3 md:p-2">
      <FloatingText text={floatingMessage} visible={!!floatingMessage} />

      <div className="battle-topbar flex items-center justify-between gap-3 rounded-2xl bg-slate-950/66 px-3 py-2 text-center md:px-4">
        <div className="text-left">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
            {enemy.isBoss ? "Boss" : "Stage"}
          </div>
          <div className="text-lg font-black leading-none md:text-2xl">{stage}</div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Badge tone={enemy.isBoss ? "amber" : "violet"}>{enemy.isBoss ? "👑" : "👾"}</Badge>
          <Badge tone="slate">
            <span className="flex items-center gap-1">
              <GameIcon src={uiIcons.reward} alt="Coins" size="sm" />
              {player.coins}
            </span>
          </Badge>
        </div>
      </div>

      <div className="battle-layout grid min-h-0 flex-1 gap-2 md:gap-3">
        <div className="flex min-h-0 flex-col gap-2 md:gap-3">
          <ProgressHud
            stage={stage}
            stageEnemyIndex={stageEnemyIndex}
            stageEnemyCount={stageEnemyCount}
            enemyHp={enemy.hp}
            enemyMaxHp={enemy.maxHp}
            playerHp={player.hp}
            playerDamage={player.damage}
            streak={player.streak}
            activeSpell={activeSpell}
          />

          <div className="min-h-0 flex-1">
            <BattleScene
              enemy={enemy}
              lastHit={lastHit}
              correctAnswersOnCurrentEnemy={correctAnswersOnCurrentEnemy}
            />
          </div>
        </div>

        <div className="battle-side-panel flex min-h-0 flex-col gap-2 md:gap-3">
          <QuestionCard text={question.text} />

          <div className="rounded-3xl bg-slate-950/60 px-3 py-2.5 md:px-4 md:py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-white/92">
                <GameIcon src={uiIcons.hint} alt="Hints" size="md" />
                <span className="text-lg font-black">x{hintCharges}</span>
              </div>
              <Button
                onClick={onUseHint}
                disabled={hintCharges <= 0}
                size="sm"
                variant="warning"
                attention={hintCharges > 0}
                className="min-w-[112px]"
              >
                <GameIcon src={uiIcons.hint} alt="Hint" size="sm" />
                Hint
              </Button>
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
    </div>
  );
}
