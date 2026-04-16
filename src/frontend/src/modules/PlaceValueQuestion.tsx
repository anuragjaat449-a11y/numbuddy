import type { PlaceValueQuestion as PQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: PQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

function TensBlock({ count, color }: { count: number; color: string }) {
  const items = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="flex gap-1 flex-wrap justify-center">
      {items.map((i) => (
        <div
          key={`ten-pos-${i}`}
          className="rounded-sm"
          style={{
            width: 14,
            height: 44,
            backgroundColor: color,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}

function OnesBlock({ count, color }: { count: number; color: string }) {
  const items = Array.from({ length: count }, (_, i) => i);
  return (
    <div
      className="flex gap-1 flex-wrap justify-center"
      style={{ maxWidth: 120 }}
    >
      {items.map((i) => (
        <div
          key={`one-pos-${i}`}
          className="rounded-sm"
          style={{
            width: 14,
            height: 14,
            backgroundColor: color,
            opacity: 0.65,
          }}
        />
      ))}
    </div>
  );
}

export default function PlaceValueQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { number, ask, answer } = question;
  const tens = Math.floor(number / 10);
  const ones = number % 10;

  return (
    <div className="flex flex-col items-center pt-6">
      <div
        className="text-5xl md:text-7xl font-medium mb-4"
        style={{
          fontFamily: "Space Grotesk, system-ui, sans-serif",
          color: "oklch(0.22 0.02 55)",
        }}
      >
        {number}
      </div>

      <p
        className="text-sm md:text-base mb-6"
        style={{ color: "oklch(0.50 0.02 60)" }}
      >
        How many <strong style={{ color: colors.accent }}>{ask}</strong>?
      </p>

      <div
        className="rounded-lg px-3 py-1.5 mb-4 text-xs text-center"
        style={{ backgroundColor: colors.bg, color: colors.accent }}
      >
        Tip: count the tall bars for tens, the small squares for ones
      </div>

      <div className="flex gap-6 items-end mb-8">
        <div className="flex flex-col items-center gap-2">
          <TensBlock count={tens} color={colors.accent} />
          <span className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>
            tens
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <OnesBlock count={ones} color={colors.accent} />
          <span className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>
            ones
          </span>
        </div>
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
