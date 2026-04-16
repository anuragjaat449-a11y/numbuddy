import StepStrip from "../components/StepStrip";
import type { MoneyReceiptQuestion as MRQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: MRQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

const RECEIPT_STEPS = [
  "Read each price",
  "Add them together",
  "Find the total",
];

export default function MoneyReceiptQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { items, total, choices } = question;

  const receiptWidth = 220;
  const lineHeight = 22;
  const topPad = 16;
  const itemsHeight = items.length * lineHeight;
  const dividerY = topPad + itemsHeight + 8;
  const totalY = dividerY + 24;
  const svgHeight = totalY + 20;

  return (
    <div className="flex flex-col items-center pt-4">
      <StepStrip
        steps={RECEIPT_STEPS}
        accent={colors.accent}
        border={colors.border}
        bg={colors.bg}
      />

      <p
        className="text-base md:text-lg font-medium mb-4"
        style={{ color: "oklch(0.22 0.02 55)" }}
      >
        What is the total?
      </p>

      <div
        className="rounded-xl p-3 mb-2"
        style={{ backgroundColor: colors.bg }}
      >
        <svg
          viewBox={`0 0 ${receiptWidth} ${svgHeight}`}
          width={receiptWidth}
          height={svgHeight}
          role="img"
          aria-label={`Receipt with ${items.length} items`}
        >
          <title>Receipt</title>

          {/* Receipt background */}
          <rect
            x={10}
            y={4}
            width={receiptWidth - 20}
            height={svgHeight - 8}
            rx={6}
            fill="oklch(1 0 0)"
            stroke={colors.border}
            strokeWidth={1}
          />

          {/* Items */}
          {items.map((item, i) => (
            <g key={`item-${i}-${item.name}`}>
              <text
                x={22}
                y={topPad + i * lineHeight + 12}
                fontSize={11}
                fill="oklch(0.35 0.02 55)"
                fontFamily="Figtree, sans-serif"
              >
                {item.name}
              </text>
              <text
                x={receiptWidth - 22}
                y={topPad + i * lineHeight + 12}
                fontSize={11}
                textAnchor="end"
                fill="oklch(0.35 0.02 55)"
                fontFamily="Figtree, sans-serif"
              >
                ${item.price}
              </text>
            </g>
          ))}

          {/* Divider */}
          <line
            x1={22}
            y1={dividerY}
            x2={receiptWidth - 22}
            y2={dividerY}
            stroke={colors.border}
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          {/* Total label + question mark */}
          <text
            x={22}
            y={totalY}
            fontSize={13}
            fontWeight="600"
            fill="oklch(0.22 0.02 55)"
            fontFamily="Figtree, sans-serif"
          >
            Total
          </text>
          <text
            x={receiptWidth - 22}
            y={totalY}
            fontSize={13}
            fontWeight="600"
            textAnchor="end"
            fill={colors.accent}
            fontFamily="Figtree, sans-serif"
          >
            $?
          </text>
        </svg>
      </div>

      <AnswerButtons
        choices={choices}
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
