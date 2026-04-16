import type { SequenceQuestion as SQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: SQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

function getPatternLabel(step: number, sequenceType?: string): string {
  if (sequenceType === "double") return "Pattern: doubles each step";
  if (sequenceType === "alternating") return "Pattern: alternates steps";
  if (step > 0) return `Pattern: +${step} each step`;
  if (step < 0) return `Pattern: ${step} each step`;
  return "Find the missing number";
}

export default function SequenceQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { sequence, answer, questionLabel } = question;
  const label = questionLabel ?? "What number goes in the blank?";

  return (
    <div className="flex flex-col items-center pt-6">
      <p
        className="text-sm md:text-base mb-6 text-center px-2"
        style={{ color: "oklch(0.50 0.02 60)" }}
      >
        {label}
      </p>

      <div
        className="rounded-full px-3 py-1 text-xs font-medium mb-4"
        style={{
          backgroundColor: colors.bg,
          color: colors.accent,
          border: `1px solid ${colors.border}`,
        }}
      >
        {getPatternLabel(question.step, question.sequenceType)}
      </div>

      <div className="flex gap-2 md:gap-3 items-center mb-8 flex-wrap justify-center">
        {sequence.map((num, i) => {
          const seqKey = `seq-${i}-${num ?? "blank"}`;
          return (
            <div
              key={seqKey}
              className="flex items-center justify-center rounded-lg font-medium text-lg md:text-2xl"
              style={{
                width: 52,
                height: 52,
                border:
                  num === null
                    ? `2px dashed ${colors.accent}`
                    : `1.5px solid ${colors.border}`,
                backgroundColor: num === null ? colors.bg : "oklch(1 0 0)",
                color: num === null ? colors.accent : "oklch(0.22 0.02 55)",
              }}
            >
              {num === null ? "?" : num}
            </div>
          );
        })}
      </div>

      <AnswerButtons
        choices={question.choices}
        correctValue={answer}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
      />
    </div>
  );
}
