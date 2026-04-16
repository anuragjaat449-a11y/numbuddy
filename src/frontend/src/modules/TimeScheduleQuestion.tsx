import type { TimeScheduleQuestion as TSQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: TSQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

export default function TimeScheduleQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  return (
    <div className="flex flex-col items-center pt-6 px-4">
      <div
        className="rounded-xl border px-5 py-4 mb-8 w-full max-w-sm text-center"
        style={{ backgroundColor: colors.bg, borderColor: colors.border }}
      >
        <p
          className="text-base md:text-lg leading-relaxed"
          style={{ color: "oklch(0.22 0.02 55)" }}
        >
          {question.prompt}
        </p>
      </div>
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
