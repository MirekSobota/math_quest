import { motion } from "framer-motion";

type Props = {
  answers: number[];
  hiddenAnswers?: number[];
  onAnswer: (answer: number) => void;
};

const optionBadges = ["A", "B", "C", "D"];
const optionStyles = [
  "from-violet-500/88 to-fuchsia-600/88 border-violet-200/24",
  "from-sky-500/88 to-cyan-500/88 border-sky-200/24",
  "from-emerald-500/88 to-teal-500/88 border-emerald-200/24",
  "from-amber-400/90 to-orange-500/90 border-amber-100/28 text-slate-950",
];

export function AnswerButtons({ answers, hiddenAnswers = [], onAnswer }: Props) {
  return (
    <div className="answer-grid grid h-full min-h-0 gap-2">
      {answers.map((answer, index) => {
        const isHidden = hiddenAnswers.includes(answer);

        return (
          <motion.button
            key={answer}
            whileTap={isHidden ? undefined : { scale: 0.97 }}
            onClick={() => {
              if (!isHidden) onAnswer(answer);
            }}
            disabled={isHidden}
            className={`answer-button ${isHidden ? "" : "btn-attention answer-pop"} flex h-full items-center justify-between rounded-2xl border px-3 py-3 font-black transition md:rounded-3xl md:px-4 md:py-4 ${
              isHidden
                ? "border-white/8 bg-white/5 text-white/25"
                : `bg-gradient-to-b ${optionStyles[index % optionStyles.length]} text-white shadow-[0_14px_28px_rgba(15,23,42,0.18)]`
            }`}
          >
            <span className={`rounded-full px-2.5 py-1 text-sm font-black ${isHidden ? "bg-white/5" : "bg-white/16"}`}>
              {optionBadges[index] ?? "?"}
            </span>
            <span className="text-center text-[1.55rem] leading-none md:text-[1.95rem]">
              {isHidden ? "?" : answer}
            </span>
            <span className={`text-lg ${isHidden ? "opacity-20" : "opacity-90"}`}>👉</span>
          </motion.button>
        );
      })}
    </div>
  );
}
