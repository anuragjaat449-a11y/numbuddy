import StepStrip from "../components/StepStrip";
import type { MoneyChangeQuestion as MCQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: MCQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

const CHANGE_STEPS = [
  "What's the cost?",
  "What did you pay?",
  "Subtract to find change",
];

// Bill visual config keyed by paid amount (in cents)
const BILL_CONFIG: Record<
  number,
  { label: string; fill: string; stroke: string; text: string; sub: string }
> = {
  100: {
    label: "$1.00",
    fill: "oklch(0.90 0.08 145)",
    stroke: "oklch(0.55 0.12 145)",
    text: "oklch(0.35 0.12 145)",
    sub: "ONE DOLLAR",
  },
  500: {
    label: "$5.00",
    fill: "oklch(0.88 0.07 225)",
    stroke: "oklch(0.52 0.13 225)",
    text: "oklch(0.32 0.13 225)",
    sub: "FIVE DOLLARS",
  },
  1000: {
    label: "$10.00",
    fill: "oklch(0.92 0.10 70)",
    stroke: "oklch(0.58 0.14 70)",
    text: "oklch(0.35 0.14 70)",
    sub: "TEN DOLLARS",
  },
  2000: {
    label: "$20.00",
    fill: "oklch(0.90 0.09 55)",
    stroke: "oklch(0.56 0.13 55)",
    text: "oklch(0.33 0.13 55)",
    sub: "TWENTY DOLLARS",
  },
};

export default function MoneyChangeQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { cost, paid, change, choices } = question;

  const bill = BILL_CONFIG[paid] ?? BILL_CONFIG[100];

  // Format cost: if >= 100 cents, show in dollars; otherwise show in cents
  const costDisplay = cost >= 100 ? `$${(cost / 100).toFixed(2)}` : `${cost}¢`;
  const changeDisplay = (v: number) =>
    v >= 100 ? `$${(v / 100).toFixed(2)}` : `${v}¢`;

  return (
    <div className="flex flex-col items-center pt-4">
      <StepStrip
        steps={CHANGE_STEPS}
        accent={colors.accent}
        border={colors.border}
        bg={colors.bg}
      />

      <p
        className="text-sm md:text-base mb-5"
        style={{ color: "oklch(0.50 0.02 60)" }}
      >
        How much change do you get?
      </p>

      {/* Bill SVG */}
      <svg
        width="180"
        height="80"
        viewBox="0 0 180 80"
        className="mb-4"
        aria-label={`A ${bill.sub} bill`}
        role="img"
      >
        <title>{bill.sub}</title>
        <rect
          x="2"
          y="2"
          width="176"
          height="76"
          rx="8"
          fill={bill.fill}
          stroke={bill.stroke}
          strokeWidth="1.5"
        />
        <rect
          x="8"
          y="8"
          width="164"
          height="64"
          rx="4"
          fill="none"
          stroke={bill.stroke}
          strokeWidth="0.75"
          strokeDasharray="2 2"
        />
        {/* Circle portrait placeholder */}
        <circle
          cx="32"
          cy="40"
          r="16"
          fill="none"
          stroke={bill.stroke}
          strokeWidth="1"
        />
        <circle cx="32" cy="34" r="6" fill={bill.stroke} opacity="0.4" />
        <path d="M18 52 Q32 44 46 52" fill={bill.stroke} opacity="0.4" />
        <text
          x="110"
          y="38"
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill={bill.text}
          fontFamily="Space Grotesk, system-ui, sans-serif"
        >
          {bill.label}
        </text>
        <text
          x="110"
          y="56"
          textAnchor="middle"
          fontSize="9"
          fill={bill.text}
          opacity="0.7"
        >
          {bill.sub}
        </text>
      </svg>

      {/* Price tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm" style={{ color: "oklch(0.50 0.02 60)" }}>
          Item costs:
        </span>
        <div
          className="rounded-lg border px-4 py-2 text-xl font-semibold"
          style={{
            fontFamily: "Space Grotesk, system-ui, sans-serif",
            borderColor: colors.border,
            backgroundColor: colors.bg,
            color: "oklch(0.22 0.02 55)",
          }}
        >
          {costDisplay}
        </div>
      </div>

      <AnswerButtons
        choices={choices}
        correctValue={change}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
        formatLabel={changeDisplay}
      />
    </div>
  );
}
