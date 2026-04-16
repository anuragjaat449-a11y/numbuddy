import type { NumberSenseTextQuestion as NSTQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: NSTQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

export default function NumberSenseTextQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  return (
    <div className="flex flex-col items-center pt-6">
      <p
        className="text-lg md:text-xl font-medium text-center mb-8 px-4 leading-snug"
        style={{
          fontFamily: "Space Grotesk, system-ui, sans-serif",
          color: "oklch(0.22 0.02 55)",
        }}
      >
        {question.prompt}
      </p>
      <AnswerButtons
        choices={question.choices}
        correctValue={question.answer}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
      />
    </div>
  );
}
