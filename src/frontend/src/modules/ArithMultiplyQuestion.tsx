import type { ArithMultiplyQuestion as AMQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: AMQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

export default function ArithMultiplyQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { a, b, answer, choices } = question;

  const showGrid = a <= 5 && b <= 8;

  // Build dot grid as flat array for rendering
  const dotGrid = showGrid
    ? Array.from({ length: a }, (_, r) =>
        Array.from({ length: b }, (_, c) => ({ r, c, key: `${r}-${c}` })),
      )
    : [];

  return (
    <div className="flex flex-col items-center pt-6">
      <p
        className="text-sm md:text-base mb-4"
        style={{ color: "oklch(0.50 0.02 60)" }}
      >
        What is the answer?
      </p>

      <div
        className="text-5xl md:text-6xl font-medium mb-6"
        style={{
          fontFamily: "Space Grotesk, system-ui, sans-serif",
          color: "oklch(0.22 0.02 55)",
        }}
      >
        {a} &times; {b} = ?
      </div>

      {showGrid && (
        <div className="flex flex-col gap-1.5 mb-6">
          {dotGrid.map((row) => (
            <div
              key={`row-${row[0].r}`}
              className="flex gap-1.5 justify-center"
            >
              {row.map((dot) => (
                <div
                  key={dot.key}
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colors.accent }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <AnswerButtons
        choices={choices}
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
