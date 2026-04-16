import type { MoneyQuestion as MQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: MQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

export default function MoneyQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { coins, total } = question;
  const svgWidth = coins.length * 64;

  return (
    <div className="flex flex-col items-center pt-6">
      <p className="text-sm mb-6" style={{ color: "oklch(0.50 0.02 60)" }}>
        What is the total value of these coins?
      </p>

      <div className="flex flex-wrap gap-4 justify-center mb-2">
        <svg
          viewBox={`0 0 ${svgWidth} 64`}
          width={svgWidth}
          height={64}
          style={{ maxWidth: "100%" }}
          aria-label={`${coins.length} coins totaling ${total} cents`}
          role="img"
        >
          <title>
            {coins.length} coins totaling {total} cents
          </title>
          {coins.map((coin, i) => (
            <g
              key={`coin-${i}-${coin.value}`}
              transform={`translate(${i * 64 + 8}, 0)`}
            >
              <circle
                cx={24}
                cy={32}
                r={24}
                fill={coin.color}
                stroke="oklch(0.70 0.01 70)"
                strokeWidth={1}
              />
              <text
                x={24}
                y={37}
                textAnchor="middle"
                fontSize={12}
                fontWeight={500}
                fill="oklch(1 0 0)"
                fontFamily="Figtree, sans-serif"
              >
                {coin.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <AnswerButtons
        choices={question.choices}
        correctValue={total}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
        formatLabel={(v) => `${v}¢`}
      />
    </div>
  );
}
