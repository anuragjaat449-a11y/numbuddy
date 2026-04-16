import { useEffect, useState } from "react";
import type { ArithScaffoldQuestion as ASQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: ASQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

type StepEntry = { id: string; text: string; pos: number };

function detectStrategy(steps: string[], op: string): string {
  if (steps[1]?.includes("10")) {
    return op === "-" ? "Bridge 10" : "Make 10";
  }
  return "Count On";
}

export default function ArithScaffoldQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { a, b, op, answer, steps } = question;
  const [visibleCount, setVisibleCount] = useState(1);
  const [showChoices, setShowChoices] = useState(false);

  const strategy = detectStrategy(steps, op);

  const stepEntries: StepEntry[] = steps.map((text, pos) => ({
    id: `step-${pos}`,
    text,
    pos,
  }));

  useEffect(() => {
    setVisibleCount(1);
    setShowChoices(false);
    let pos = 1;
    const reveal = () => {
      if (pos < steps.length) {
        setVisibleCount(pos + 1);
        pos++;
        setTimeout(reveal, 700);
      } else {
        setTimeout(() => setShowChoices(true), 300);
      }
    };
    const t = setTimeout(reveal, 700);
    return () => clearTimeout(t);
  }, [steps.length]);

  const visibleEntries = stepEntries.slice(0, visibleCount);

  return (
    <div className="flex flex-col items-center pt-4">
      {/* Strategy badge */}
      <div
        className="mb-4 px-3 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: colors.bg,
          color: colors.accent,
          border: `1px solid ${colors.accent}`,
          fontFamily: "Figtree, sans-serif",
        }}
      >
        Strategy: {strategy}
      </div>

      <div
        className="text-4xl md:text-5xl font-medium mb-6"
        style={{
          fontFamily: "Space Grotesk, system-ui, sans-serif",
          color: "oklch(0.22 0.02 55)",
        }}
      >
        {a} {op === "+" ? "+" : "−"} {b} = ?
      </div>

      <div
        className="rounded-xl border p-4 md:p-5 mb-4 w-full max-w-xs"
        style={{ borderColor: colors.border, backgroundColor: colors.bg }}
      >
        {visibleEntries.map((entry) => (
          <div
            key={entry.id}
            className="text-base md:text-lg font-medium py-1"
            style={{
              color:
                entry.pos === visibleCount - 1
                  ? colors.accent
                  : "oklch(0.40 0.02 55)",
              fontFamily: "Space Grotesk, system-ui, sans-serif",
              transition: "opacity 0.4s ease",
            }}
          >
            {entry.text}
          </div>
        ))}
      </div>

      {(showChoices || answered) && (
        <AnswerButtons
          choices={question.choices}
          correctValue={answer}
          answered={answered}
          selectedIdx={selectedIdx}
          correctIdx={correctIdx}
          colors={colors}
          onChoice={onChoice}
        />
      )}
    </div>
  );
}
