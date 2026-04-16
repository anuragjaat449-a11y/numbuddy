import { useEffect, useState } from "react";
import type { NumberQuestion as NQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: NQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

export default function NumberQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const [visible, setVisible] = useState(true);

  // Component is remounted via key prop when question changes,
  // so this effect only needs to run once on mount.
  useEffect(() => {
    const t = setTimeout(
      () => setVisible(false),
      question.flashDuration ?? 1500,
    );
    return () => clearTimeout(t);
  }, [question.flashDuration]);

  return (
    <div className="flex flex-col items-center pt-6">
      <p className="text-sm mb-6" style={{ color: "oklch(0.50 0.02 60)" }}>
        {visible ? "Remember the dots..." : "How many dots did you see?"}
      </p>

      {visible && (
        <p
          className="text-xs text-center mb-3 px-4"
          style={{ color: "oklch(0.58 0.04 280)" }}
        >
          Look at the whole group — try not to count one by one
        </p>
      )}

      <div
        className="mb-2"
        style={{
          width: 160,
          height: 160,
          transition: "opacity 0.4s ease",
          opacity: visible ? 1 : 0,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="160"
          height="160"
          aria-label={`${question.value} dots`}
          role="img"
        >
          <title>{question.value} dots</title>
          {question.dots.map(([x, y], i) => (
            <circle
              key={`dot-${i}-${x.toFixed(1)}-${y.toFixed(1)}`}
              cx={x}
              cy={y}
              r={5}
              fill={colors.accent}
            />
          ))}
        </svg>
      </div>

      <AnswerButtons
        choices={question.choices}
        correctValue={question.value}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
      />
    </div>
  );
}
