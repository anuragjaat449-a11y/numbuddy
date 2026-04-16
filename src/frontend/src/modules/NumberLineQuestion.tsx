import type { ReactNode } from "react";
import type {
  AnyNumberLineQuestion,
  NumberLineQuestion as NLQ,
  NumberLineCloserQuestion,
  NumberLineHalfwayQuestion,
  NumberLineHopsQuestion,
} from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: AnyNumberLineQuestion;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

const SVG_W = 440;
const SVG_H = 90;
const LINE_Y = 54;
const LINE_X0 = 24;
const LINE_X1 = SVG_W - 24;
const LINE_LEN = LINE_X1 - LINE_X0;

function xFor(v: number, rangeMin: number, rangeMax: number): number {
  return LINE_X0 + ((v - rangeMin) / (rangeMax - rangeMin)) * LINE_LEN;
}

function buildTicks(
  rangeMin: number,
  rangeMax: number,
): { val: number; isMajor: boolean }[] {
  const range = rangeMax - rangeMin;
  const tickInterval = range <= 10 ? 1 : range <= 20 ? 2 : range <= 30 ? 2 : 5;
  const majorInterval =
    range <= 10 ? 5 : range <= 20 ? 5 : range <= 30 ? 5 : 10;
  const count = Math.floor(range / tickInterval);
  return Array.from({ length: count + 1 }, (_, i) => {
    const val = rangeMin + i * tickInterval;
    const isMajor =
      (val - rangeMin) % majorInterval === 0 ||
      val === rangeMin ||
      val === rangeMax;
    return { val, isMajor };
  });
}

function NumberLineBase({
  rangeMin,
  rangeMax,
  colors,
  children,
  ariaLabel,
}: {
  rangeMin: number;
  rangeMax: number;
  colors: { accent: string; bg: string; border: string };
  children?: ReactNode;
  ariaLabel: string;
}) {
  const ticks = buildTicks(rangeMin, rangeMax);
  return (
    <div
      className="rounded-xl p-4 md:p-5"
      style={{ backgroundColor: colors.bg }}
    >
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        {/* Main axis line */}
        <line
          x1={LINE_X0}
          y1={LINE_Y}
          x2={LINE_X1}
          y2={LINE_Y}
          stroke="oklch(0.45 0.02 55)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Ticks */}
        {ticks.map(({ val, isMajor }) => {
          const x = xFor(val, rangeMin, rangeMax);
          const h = isMajor ? 10 : 6;
          return (
            <g key={val}>
              <line
                x1={x}
                y1={LINE_Y - h / 2}
                x2={x}
                y2={LINE_Y + h / 2}
                stroke="oklch(0.45 0.02 55)"
                strokeWidth={isMajor ? 2 : 1}
              />
              {isMajor && (
                <text
                  x={x}
                  y={LINE_Y + 22}
                  textAnchor="middle"
                  fontSize="12"
                  fill="oklch(0.45 0.02 55)"
                  fontFamily="Figtree, sans-serif"
                >
                  {val}
                </text>
              )}
            </g>
          );
        })}
        {children}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Original: identify the marker
// ---------------------------------------------------------------------------
function IdentifyQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Omit<Props, "question"> & { question: NLQ }) {
  const { markerValue, choices, rangeMax, rangeMin = 0 } = question;
  const markerX = xFor(markerValue, rangeMin, rangeMax);
  return (
    <div className="flex flex-col gap-4">
      <p
        className="text-base md:text-lg font-medium"
        style={{ color: "oklch(0.22 0.02 55)" }}
      >
        Where is the marker on this number line?
      </p>
      {question.rangeMin < 0 && (
        <p
          className="text-sm rounded-lg px-3 py-2 mb-1"
          style={{
            backgroundColor: colors.bg,
            color: "oklch(0.40 0.06 55)",
            maxWidth: 360,
          }}
        >
          This number line includes negative numbers — they sit to the left of
          zero.
        </p>
      )}
      <NumberLineBase
        rangeMin={rangeMin}
        rangeMax={rangeMax}
        colors={colors}
        ariaLabel={`Number line from ${rangeMin} to ${rangeMax} with a marker`}
      >
        <polygon
          points={`${markerX - 8},${LINE_Y - 18} ${markerX + 8},${LINE_Y - 18} ${markerX},${LINE_Y - 6}`}
          fill={colors.accent}
          stroke="oklch(1 0 0)"
          strokeWidth="1.5"
        />
      </NumberLineBase>
      <AnswerButtons
        choices={choices}
        correctValue={markerValue}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Halfway: which number is halfway between X and Y?
// ---------------------------------------------------------------------------
function HalfwayQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Omit<Props, "question"> & { question: NumberLineHalfwayQuestion }) {
  const { low, high, answer, rangeMin, rangeMax, choices } = question;
  const lowX = xFor(low, rangeMin, rangeMax);
  const highX = xFor(high, rangeMin, rangeMax);
  const midX = xFor(answer, rangeMin, rangeMax);
  return (
    <div className="flex flex-col gap-4">
      <p
        className="text-base md:text-lg font-medium"
        style={{ color: "oklch(0.22 0.02 55)" }}
      >
        Which number is halfway between{" "}
        <span style={{ color: colors.accent }}>{low}</span> and{" "}
        <span style={{ color: colors.accent }}>{high}</span>?
      </p>
      <NumberLineBase
        rangeMin={rangeMin}
        rangeMax={rangeMax}
        colors={colors}
        ariaLabel={`Number line showing ${low} and ${high} with a midpoint question`}
      >
        {/* Bracket spans low to high */}
        <line
          x1={lowX}
          y1={LINE_Y - 22}
          x2={highX}
          y2={LINE_Y - 22}
          stroke={colors.accent}
          strokeWidth="2"
        />
        <line
          x1={lowX}
          y1={LINE_Y - 28}
          x2={lowX}
          y2={LINE_Y - 16}
          stroke={colors.accent}
          strokeWidth="2"
        />
        <line
          x1={highX}
          y1={LINE_Y - 28}
          x2={highX}
          y2={LINE_Y - 16}
          stroke={colors.accent}
          strokeWidth="2"
        />
        <text
          x={lowX}
          y={LINE_Y - 32}
          textAnchor="middle"
          fontSize="13"
          fill={colors.accent}
          fontFamily="Figtree, sans-serif"
          fontWeight="700"
        >
          {low}
        </text>
        <text
          x={highX}
          y={LINE_Y - 32}
          textAnchor="middle"
          fontSize="13"
          fill={colors.accent}
          fontFamily="Figtree, sans-serif"
          fontWeight="700"
        >
          {high}
        </text>
        <circle
          cx={midX}
          cy={LINE_Y}
          r="10"
          fill="oklch(1 0 0)"
          stroke={colors.border}
          strokeWidth="1.5"
        />
        <text
          x={midX}
          y={LINE_Y + 5}
          textAnchor="middle"
          fontSize="14"
          fill={colors.accent}
          fontFamily="Figtree, sans-serif"
          fontWeight="700"
        >
          ?
        </text>
      </NumberLineBase>
      <AnswerButtons
        choices={choices}
        correctValue={answer}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Closer: is the target closer to anchorA or anchorB?
// ---------------------------------------------------------------------------
function CloserQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Omit<Props, "question"> & { question: NumberLineCloserQuestion }) {
  const { target, anchorA, anchorB, rangeMin, rangeMax, answer, choices } =
    question;
  const targetX = xFor(target, rangeMin, rangeMax);
  const aX = xFor(anchorA, rangeMin, rangeMax);
  const bX = xFor(anchorB, rangeMin, rangeMax);
  return (
    <div className="flex flex-col gap-4">
      <p
        className="text-base md:text-lg font-medium"
        style={{ color: "oklch(0.22 0.02 55)" }}
      >
        Is <span style={{ color: colors.accent }}>{target}</span> closer to{" "}
        <span style={{ color: colors.accent }}>{anchorA}</span> or{" "}
        <span style={{ color: colors.accent }}>{anchorB}</span>?
      </p>
      <NumberLineBase
        rangeMin={rangeMin}
        rangeMax={rangeMax}
        colors={colors}
        ariaLabel={`Number line with ${target} shown — is it closer to ${anchorA} or ${anchorB}?`}
      >
        {/* Anchor A diamond */}
        <polygon
          points={`${aX},${LINE_Y - 18} ${aX + 7},${LINE_Y - 11} ${aX},${LINE_Y - 4} ${aX - 7},${LINE_Y - 11}`}
          fill={colors.border}
          stroke={colors.accent}
          strokeWidth="1.5"
        />
        <text
          x={aX}
          y={LINE_Y - 22}
          textAnchor="middle"
          fontSize="12"
          fill={colors.accent}
          fontFamily="Figtree, sans-serif"
          fontWeight="700"
        >
          {anchorA}
        </text>
        {/* Anchor B diamond */}
        <polygon
          points={`${bX},${LINE_Y - 18} ${bX + 7},${LINE_Y - 11} ${bX},${LINE_Y - 4} ${bX - 7},${LINE_Y - 11}`}
          fill={colors.border}
          stroke={colors.accent}
          strokeWidth="1.5"
        />
        <text
          x={bX}
          y={LINE_Y - 22}
          textAnchor="middle"
          fontSize="12"
          fill={colors.accent}
          fontFamily="Figtree, sans-serif"
          fontWeight="700"
        >
          {anchorB}
        </text>
        {/* Target triangle */}
        <polygon
          points={`${targetX - 8},${LINE_Y - 18} ${targetX + 8},${LINE_Y - 18} ${targetX},${LINE_Y - 6}`}
          fill={colors.accent}
          stroke="oklch(1 0 0)"
          strokeWidth="1.5"
        />
        <text
          x={targetX}
          y={LINE_Y - 21}
          textAnchor="middle"
          fontSize="11"
          fill="oklch(1 0 0)"
          fontFamily="Figtree, sans-serif"
          fontWeight="700"
        >
          {target}
        </text>
      </NumberLineBase>
      <AnswerButtons
        choices={choices}
        correctValue={answer}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hops: start at X, take Y hops of Z — where do you land?
// ---------------------------------------------------------------------------
function HopsQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Omit<Props, "question"> & { question: NumberLineHopsQuestion }) {
  const { start, hops, hopSize, answer, rangeMin, rangeMax, choices } =
    question;
  const startX = xFor(start, rangeMin, rangeMax);
  const hopPositions = Array.from({ length: hops }, (_, i) => ({
    from: xFor(start + i * hopSize, rangeMin, rangeMax),
    to: xFor(start + (i + 1) * hopSize, rangeMin, rangeMax),
    landVal: start + (i + 1) * hopSize,
  }));
  const answerX = xFor(answer, rangeMin, rangeMax);
  return (
    <div className="flex flex-col gap-4">
      <p
        className="text-base md:text-lg font-medium"
        style={{ color: "oklch(0.22 0.02 55)" }}
      >
        Start at <span style={{ color: colors.accent }}>{start}</span>. Take{" "}
        <span style={{ color: colors.accent }}>{hops}</span> hop
        {hops !== 1 ? "s" : ""} of{" "}
        <span style={{ color: colors.accent }}>{hopSize}</span>. Where do you
        land?
      </p>
      <NumberLineBase
        rangeMin={rangeMin}
        rangeMax={rangeMax}
        colors={colors}
        ariaLabel={`Number line: start at ${start}, ${hops} hops of ${hopSize}`}
      >
        {/* Start marker */}
        <circle
          cx={startX}
          cy={LINE_Y}
          r="6"
          fill={colors.accent}
          stroke="oklch(1 0 0)"
          strokeWidth="1.5"
        />
        <text
          x={startX}
          y={LINE_Y - 12}
          textAnchor="middle"
          fontSize="12"
          fill={colors.accent}
          fontFamily="Figtree, sans-serif"
          fontWeight="700"
        >
          {start}
        </text>
        {/* Hop arcs */}
        {hopPositions.map((hop, i) => {
          const midX = (hop.from + hop.to) / 2;
          const arcY = LINE_Y - 34;
          const isLast = i === hops - 1;
          return (
            <g key={`hop-${hop.landVal}`}>
              <path
                d={`M ${hop.from} ${LINE_Y} Q ${midX} ${arcY} ${hop.to} ${LINE_Y}`}
                fill="none"
                stroke={colors.accent}
                strokeWidth="1.5"
                opacity="0.7"
              />
              {/* Arrowhead at landing */}
              <polygon
                points={`${hop.to - 4},${LINE_Y - 8} ${hop.to + 4},${LINE_Y - 8} ${hop.to},${LINE_Y}`}
                fill={colors.accent}
                opacity="0.7"
              />
              {!isLast && (
                <text
                  x={hop.to}
                  y={LINE_Y + 18}
                  textAnchor="middle"
                  fontSize="10"
                  fill="oklch(0.50 0.05 55)"
                  fontFamily="Figtree, sans-serif"
                >
                  {hop.landVal}
                </text>
              )}
            </g>
          );
        })}
        {/* Question mark at answer */}
        <circle
          cx={answerX}
          cy={LINE_Y}
          r="10"
          fill="oklch(1 0 0)"
          stroke={colors.accent}
          strokeWidth="2"
        />
        <text
          x={answerX}
          y={LINE_Y + 5}
          textAnchor="middle"
          fontSize="14"
          fill={colors.accent}
          fontFamily="Figtree, sans-serif"
          fontWeight="700"
        >
          ?
        </text>
      </NumberLineBase>
      <AnswerButtons
        choices={choices}
        correctValue={answer}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main dispatcher
// ---------------------------------------------------------------------------
export default function NumberLineQuestion(props: Props) {
  const { question } = props;
  switch (question.type) {
    case "numberline":
      return <IdentifyQuestion {...props} question={question} />;
    case "numberline_halfway":
      return <HalfwayQuestion {...props} question={question} />;
    case "numberline_closer":
      return <CloserQuestion {...props} question={question} />;
    case "numberline_hops":
      return <HopsQuestion {...props} question={question} />;
  }
}
