import type { EstimationQuestion as EQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: EQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

const BAR_LABELS = ["A", "B", "C"];
const BAR_COLORS_LIGHT = [
  "oklch(0.60 0.14 25)",
  "oklch(0.55 0.18 145)",
  "oklch(0.55 0.14 270)",
];

export default function EstimationQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const variant = question.variant ?? "dots";

  return (
    <div className="flex flex-col items-center pt-4">
      {variant === "dots" && (
        <DotsVariant question={question} colors={colors} />
      )}
      {variant === "bars" && (
        <BarsVariant question={question} colors={colors} />
      )}
      {variant === "jar" && <JarVariant question={question} colors={colors} />}

      <AnswerButtons
        choices={question.choices}
        correctValue={question.answerLabel}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
      />
    </div>
  );
}

function DotsVariant({
  question,
  colors,
}: {
  question: EQ;
  colors: { accent: string; bg: string; border: string };
}) {
  const { dots = [] } = question;
  return (
    <>
      <p
        className="text-base md:text-lg font-medium mb-4"
        style={{ color: "oklch(0.22 0.02 55)" }}
      >
        About how many dots do you see?
      </p>
      <div
        className="rounded-xl w-full mb-2"
        style={{ backgroundColor: colors.bg, maxWidth: 320 }}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          style={{ display: "block" }}
          role="img"
          aria-label="Scattered dots — estimate the count"
        >
          <title>Scattered dots — estimate the count</title>
          {dots.map(([x, y], i) => (
            <circle
              key={`edot-${i}-${x.toFixed(1)}-${y.toFixed(1)}`}
              cx={x}
              cy={y}
              r={2.8}
              fill={colors.accent}
            />
          ))}
        </svg>
      </div>
    </>
  );
}

function BarsVariant({
  question,
  colors,
}: {
  question: EQ;
  colors: { accent: string; bg: string; border: string };
}) {
  const { barValues = [20, 35, 15], askBarIndex = 1 } = question;
  const maxVal = 50;
  const svgW = 200;
  const svgH = 160;
  const barW = 36;
  const gap = 20;
  const groundY = svgH - 24;
  const barLabel = BAR_LABELS[askBarIndex];

  return (
    <>
      <p
        className="text-base md:text-lg font-medium mb-4"
        style={{ color: "oklch(0.22 0.02 55)" }}
      >
        About how tall is bar{" "}
        <span style={{ color: colors.accent, fontWeight: 700 }}>
          {barLabel}
        </span>
        ?
      </p>
      <div
        className="rounded-xl p-3 mb-2"
        style={{ backgroundColor: colors.bg }}
      >
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          width={svgW}
          height={svgH}
          role="img"
          aria-label={`Three bars labelled A, B and C — estimate the height of bar ${barLabel}`}
        >
          <title>Bar height estimation</title>
          {/* Y-axis */}
          <line
            x1={24}
            y1={8}
            x2={24}
            y2={groundY}
            stroke="oklch(0.70 0.02 55)"
            strokeWidth={1.5}
          />
          {/* Ground line */}
          <line
            x1={24}
            y1={groundY}
            x2={svgW - 8}
            y2={groundY}
            stroke="oklch(0.70 0.02 55)"
            strokeWidth={1.5}
          />
          {barValues.map((val, i) => {
            const barH = (val / maxVal) * (groundY - 12);
            const x = 36 + i * (barW + gap);
            const y = groundY - barH;
            const isAsked = i === askBarIndex;
            const fill = isAsked ? colors.accent : BAR_COLORS_LIGHT[i];
            return (
              <g key={BAR_LABELS[i]}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  rx={3}
                  fill={fill}
                  opacity={isAsked ? 1 : 0.45}
                />
                {isAsked && (
                  <text
                    x={x + barW / 2}
                    y={y - 5}
                    textAnchor="middle"
                    fontSize={11}
                    fill={colors.accent}
                    fontFamily="Figtree, sans-serif"
                    fontWeight="700"
                  >
                    ?
                  </text>
                )}
                <text
                  x={x + barW / 2}
                  y={groundY + 14}
                  textAnchor="middle"
                  fontSize={12}
                  fill={isAsked ? colors.accent : "oklch(0.50 0.02 55)"}
                  fontFamily="Figtree, sans-serif"
                  fontWeight={isAsked ? "700" : "400"}
                >
                  {BAR_LABELS[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </>
  );
}

function JarVariant({
  question,
  colors,
}: {
  question: EQ;
  colors: { accent: string; bg: string; border: string };
}) {
  const { fillPercent = 50 } = question;
  const svgW = 140;
  const svgH = 180;
  const jarX = 24;
  const jarY = 20;
  const jarW = svgW - 48;
  const jarH = 130;
  const fillH = (fillPercent / 100) * jarH;
  const fillY = jarY + jarH - fillH;

  return (
    <>
      <p
        className="text-base md:text-lg font-medium mb-4"
        style={{ color: "oklch(0.22 0.02 55)" }}
      >
        About how full is this jar?
      </p>
      <div
        className="rounded-xl p-3 mb-2"
        style={{ backgroundColor: colors.bg }}
      >
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          width={svgW}
          height={svgH}
          role="img"
          aria-label={`A jar that is about ${Math.round(fillPercent)}% full`}
        >
          <title>Jar fill estimation</title>
          {/* Jar outline */}
          <rect
            x={jarX}
            y={jarY}
            width={jarW}
            height={jarH}
            rx={8}
            fill="oklch(0.97 0.01 55)"
            stroke="oklch(0.60 0.03 55)"
            strokeWidth={2}
          />
          {/* Fill */}
          <clipPath id="jar-clip">
            <rect x={jarX} y={jarY} width={jarW} height={jarH} rx={8} />
          </clipPath>
          <rect
            x={jarX}
            y={fillY}
            width={jarW}
            height={fillH}
            fill={colors.accent}
            opacity={0.7}
            clipPath="url(#jar-clip)"
          />
          {/* Jar outline on top */}
          <rect
            x={jarX}
            y={jarY}
            width={jarW}
            height={jarH}
            rx={8}
            fill="none"
            stroke="oklch(0.50 0.03 55)"
            strokeWidth={2}
          />
          {/* Lid */}
          <rect
            x={jarX - 4}
            y={jarY - 10}
            width={jarW + 8}
            height={12}
            rx={4}
            fill="oklch(0.75 0.04 55)"
            stroke="oklch(0.55 0.03 55)"
            strokeWidth={1.5}
          />
          {/* Question mark label */}
          <text
            x={jarX + jarW / 2}
            y={jarY + jarH + 18}
            textAnchor="middle"
            fontSize={13}
            fill={colors.accent}
            fontFamily="Figtree, sans-serif"
            fontWeight="700"
          >
            How full?
          </text>
        </svg>
      </div>
    </>
  );
}
