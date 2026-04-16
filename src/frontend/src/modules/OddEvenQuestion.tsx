import type { OddEvenQuestion as OEQ } from "../game/questions";

interface Props {
  question: OEQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

export default function OddEvenQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { value, answer, choices } = question;
  const correctIndex = choices.findIndex((c) => c === answer);

  return (
    <div className="flex flex-col items-center pt-6">
      <p
        className="text-sm md:text-base mb-6"
        style={{ color: "oklch(0.50 0.02 60)" }}
      >
        Is this number odd or even?
      </p>

      <div
        className="text-8xl md:text-9xl font-medium mb-8"
        style={{
          fontFamily: "Space Grotesk, system-ui, sans-serif",
          color: "oklch(0.22 0.02 55)",
        }}
      >
        {value}
      </div>

      <div className="grid grid-cols-2 gap-2.5 w-full mt-2">
        {choices.map((choice, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrectSlot =
            correctIdx === idx || (answered && idx === correctIndex);

          let bgColor = "transparent";
          let borderColor = colors.border;
          let textColor = "oklch(0.22 0.02 55)";

          if (answered) {
            if (isCorrectSlot) {
              bgColor = "oklch(0.93 0.05 155)";
              borderColor = "oklch(0.50 0.15 155)";
              textColor = "oklch(0.40 0.15 155)";
            } else if (isSelected && !isCorrectSlot) {
              bgColor = "oklch(0.94 0.06 25)";
              borderColor = "oklch(0.52 0.20 25)";
              textColor = "oklch(0.42 0.20 25)";
            }
          }

          const ocidIdx = idx + 1;

          return (
            <button
              key={choice}
              type="button"
              data-ocid={`game.answer_button.${ocidIdx}`}
              disabled={answered}
              onClick={() => onChoice(idx, choice === answer, correctIndex)}
              className="py-4 px-4 rounded-lg border text-base font-semibold transition-colors text-center capitalize"
              style={{
                backgroundColor: bgColor,
                borderColor,
                color: textColor,
                borderWidth: "0.5px",
                cursor: answered ? "default" : "pointer",
                minHeight: "56px",
              }}
              onMouseEnter={(e) => {
                if (!answered) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    colors.bg;
                }
              }}
              onMouseLeave={(e) => {
                if (!answered) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "transparent";
                }
              }}
            >
              {choice.charAt(0).toUpperCase() + choice.slice(1)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
