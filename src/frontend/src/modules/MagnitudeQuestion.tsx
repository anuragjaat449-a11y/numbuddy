import type { MagnitudeQuestion as MQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: MQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

export default function MagnitudeQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { a, b, answer } = question;
  const correctValue = answer === "a" ? a : b;
  const choices = [a, b];

  return (
    <div className="flex flex-col items-center pt-6">
      <p
        className="text-sm md:text-base mb-8"
        style={{ color: "oklch(0.50 0.02 60)" }}
      >
        Which number is bigger?
      </p>

      <div className="flex gap-8 md:gap-16 items-center justify-center mb-6">
        {choices.map((num) => (
          <div
            key={num}
            className="text-6xl md:text-8xl font-medium"
            style={{
              fontFamily: "Space Grotesk, system-ui, sans-serif",
              color: "oklch(0.22 0.02 55)",
            }}
          >
            {num}
          </div>
        ))}
      </div>

      <AnswerButtons
        choices={choices}
        correctValue={correctValue}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
      />
    </div>
  );
}
