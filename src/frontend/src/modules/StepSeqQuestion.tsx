import type { StepSeqQuestion as StepSeqQuestionData } from "../game/questions";

interface Colors {
  accent: string;
  bg: string;
  border: string;
}

interface Props {
  question: StepSeqQuestionData;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: Colors;
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

export default function StepSeqQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { prompt, steps, missingIndex, choices, answer } = question;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <p
          className="text-lg md:text-xl font-medium mb-5 text-center"
          style={{
            fontFamily: "Space Grotesk, system-ui, sans-serif",
            color: "oklch(0.22 0.02 55)",
          }}
        >
          {prompt}
        </p>

        {/* Sequence steps */}
        <ol className="flex flex-col gap-2 max-w-md mx-auto">
          {steps.map((step, i) => {
            const isMissing = i === missingIndex;
            return (
              <li
                key={step || `missing-step-${missingIndex}`}
                className="flex items-center gap-3 rounded-lg px-4 py-3 border"
                style={{
                  borderColor: isMissing ? colors.accent : colors.border,
                  backgroundColor: isMissing ? colors.bg : "oklch(1 0 0)",
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: isMissing
                      ? colors.accent
                      : "oklch(0.92 0.02 60)",
                    color: isMissing ? "oklch(1 0 0)" : "oklch(0.45 0.03 60)",
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="text-sm md:text-base font-medium"
                  style={{
                    color: isMissing ? colors.accent : "oklch(0.28 0.02 55)",
                    fontStyle: isMissing ? "italic" : "normal",
                  }}
                >
                  {isMissing ? "?" : step}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Answer choices */}
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto w-full">
        {choices.map((choice, idx) => {
          let borderCol = colors.border;
          let bgCol = "oklch(1 0 0)";
          let textCol = "oklch(0.28 0.02 55)";

          if (answered) {
            if (idx === correctIdx) {
              borderCol = "oklch(0.55 0.18 145)";
              bgCol = "oklch(0.93 0.06 145)";
              textCol = "oklch(0.30 0.14 145)";
            } else if (idx === selectedIdx && idx !== correctIdx) {
              borderCol = "oklch(0.60 0.15 25)";
              bgCol = "oklch(0.95 0.05 25)";
              textCol = "oklch(0.40 0.12 25)";
            }
          }

          return (
            <button
              key={`choice-${choice}`}
              type="button"
              data-ocid={`stepseq.choice.${idx + 1}`}
              disabled={answered}
              onClick={() => onChoice(idx, idx === answer, answer)}
              className="rounded-lg border px-3 py-3 text-sm md:text-base text-left font-medium transition-colors min-h-[52px] md:min-h-[60px] disabled:cursor-default"
              style={{
                borderColor: borderCol,
                backgroundColor: bgCol,
                color: textCol,
              }}
              onMouseEnter={(e) => {
                if (!answered) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    colors.bg;
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    colors.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (!answered) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "oklch(1 0 0)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    colors.border;
                }
              }}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
