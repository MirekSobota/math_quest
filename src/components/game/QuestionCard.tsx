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
      className="rounded-3xl bg-white px-4 py-4 text-center text-slate-900 shadow-lg"
    >
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
        Math Challenge
      </div>
      <div className="mt-2 text-3xl font-black leading-tight">{text}</div>
    </motion.div>
  );
}
