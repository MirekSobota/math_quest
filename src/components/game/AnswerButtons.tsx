import { motion } from "framer-motion";

type Props = {
  answers: number[];
  hiddenAnswers?: number[];
  onAnswer: (answer: number) => void;
};

export function AnswerButtons({
  answers,
  hiddenAnswers = [],
  onAnswer,
}: Props) {
  return (
    <div className="grid h-full grid-cols-2 gap-2">
      {answers.map((answer) => {
        const isHidden = hiddenAnswers.includes(answer);

        return (
          <motion.button
            key={answer}
            whileTap={isHidden ? undefined : { scale: 0.97 }}
            onClick={() => {
              if (!isHidden) onAnswer(answer);
            }}
            disabled={isHidden}
            className={`rounded-2xl px-3 py-4 text-2xl font-bold transition ${
              isHidden ? "bg-white/5 text-white/25" : "bg-white/10 text-white"
            }`}
          >
            {isHidden ? "✦" : answer}
          </motion.button>
        );
      })}
    </div>
  );
}
