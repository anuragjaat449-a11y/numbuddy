import type { MoneyBillsQuestion as MBQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: MBQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

export default function MoneyBillsQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { bills, total } = question;
  const billW = 80;
  const billH = 40;
  const gap = 10;
  const svgWidth = bills.length * (billW + gap) - gap;

  return (
    <div className="flex flex-col items-center pt-6">
      <p
        className="text-sm md:text-base mb-6"
        style={{ color: "oklch(0.50 0.02 60)" }}
      >
        What is the total?
      </p>

      <div className="mb-6">
        <svg
          viewBox={`0 0 ${svgWidth} ${billH}`}
          width={Math.min(svgWidth * 1.5, 360)}
          height={billH * 1.5}
          style={{ maxWidth: "100%" }}
          aria-label={`${bills.length} bills totaling $${total}`}
          role="img"
        >
          <title>
            {bills.length} bills totaling ${total}
          </title>
          {bills.map((bill, i) => (
            <g
              key={`bill-${i}-${bill.value}`}
              transform={`translate(${i * (billW + gap)}, 0)`}
            >
              <rect
                width={billW}
                height={billH}
                rx={4}
                ry={4}
                fill={bill.color}
                opacity={0.85}
              />
              <rect
                x={4}
                y={4}
                width={billW - 8}
                height={billH - 8}
                rx={2}
                ry={2}
                fill="none"
                stroke="oklch(1 0 0 / 0.3)"
                strokeWidth={1}
              />
              <text
                x={billW / 2}
                y={billH / 2 + 5}
                textAnchor="middle"
                fontSize={14}
                fontWeight={600}
                fill="oklch(1 0 0)"
                fontFamily="Figtree, sans-serif"
              >
                {bill.label}
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
        formatLabel={(v) => `$${v}`}
      />
    </div>
  );
}
