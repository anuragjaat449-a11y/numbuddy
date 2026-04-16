import type { ArithQuestion as AQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: AQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

export default function ArithQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { op, a, b, answer } = question;
  const total = op === "+" ? a + b : a;
  const blockSize = Math.min(28, Math.max(18, Math.floor(260 / (total + 2))));

  const blocks =
    op === "+"
      ? [
          ...Array.from({ length: a }, (_, i) => ({
            key: `a-${i}`,
            color: "oklch(0.52 0.15 160)",
          })),
          ...Array.from({ length: b }, (_, i) => ({
            key: `b-${i}`,
            color: "oklch(0.55 0.14 220)",
          })),
        ]
      : Array.from({ length: a }, (_, i) => ({
          key: `block-${i}`,
          color: i < answer ? "oklch(0.52 0.15 160)" : "oklch(0.80 0.01 70)",
        }));

  return (
    <div className="flex flex-col items-center pt-6">
      <div
        className="text-4xl font-medium mb-6"
        style={{
          fontFamily: "Space Grotesk, system-ui, sans-serif",
          color: "oklch(0.22 0.02 55)",
        }}
      >
        {a} {op === "+" ? "+" : "−"} {b} = ?
      </div>

      <div
        className="flex flex-wrap gap-1 mb-2 justify-center"
        style={{ maxWidth: 280 }}
      >
        {blocks.map((block) => (
          <div
            key={block.key}
            style={{
              width: blockSize,
              height: blockSize,
              backgroundColor: block.color,
              borderRadius: 3,
            }}
          />
        ))}
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
