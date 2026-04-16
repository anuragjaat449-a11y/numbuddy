interface Props<T> {
  choices: T[];
  correctValue: T;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
  formatLabel?: (v: T) => string;
}

export default function AnswerButtons<T extends string | number>({
  choices,
  correctValue,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
  formatLabel,
}: Props<T>) {
  const correctIndex = choices.findIndex((c) => c === correctValue);

  return (
    <div className="grid grid-cols-2 gap-2.5 mt-6">
      {choices.map((choice, idx) => {
        const isSelected = selectedIdx === idx;
        const isCorrectSlot =
          correctIdx === idx || (answered && idx === correctIndex);

        let bgColor = "transparent";
        let borderColor = colors.border;
        let textColor = "oklch(0.22 0.02 55)";
        let borderWidth = "0.5px";

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
        } else if (isSelected) {
          // Tapped but not yet answered — show selected state
          bgColor = colors.bg;
          borderColor = colors.accent;
          textColor = colors.accent;
          borderWidth = "1.5px";
        }

        const ocidIdx = idx + 1;
        const choiceKey = `choice-${idx}-${String(choice)}`;

        return (
          <button
            type="button"
            key={choiceKey}
            data-ocid={`game.answer_button.${ocidIdx}`}
            disabled={answered}
            onClick={() => onChoice(idx, choice === correctValue, correctIndex)}
            className="py-3 px-4 rounded-lg border text-sm font-medium transition-colors text-center"
            style={{
              backgroundColor: bgColor,
              borderColor,
              color: textColor,
              borderWidth,
              cursor: answered ? "default" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!answered && !isSelected) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  colors.bg;
              }
            }}
            onMouseLeave={(e) => {
              if (!answered && !isSelected) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }
            }}
          >
            {formatLabel ? formatLabel(choice) : String(choice)}
          </button>
        );
      })}
    </div>
  );
}
