import { motion } from "framer-motion";

type Props = {
  text: string;
};

export function QuestionCard({ text }: Props) {
  return (
    <motion.div
      key={text}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="question-card rounded-3xl bg-white text-center text-slate-900 shadow-[0_20px_48px_rgba(255,255,255,0.16)]"
    >
      <div className="question-eyebrow font-black uppercase text-slate-500">🧠</div>
      <div className="question-text mt-1.5 font-black text-slate-950">{text}</div>
    </motion.div>
  );
}
