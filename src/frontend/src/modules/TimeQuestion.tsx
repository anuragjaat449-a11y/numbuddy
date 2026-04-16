import StepStrip from "../components/StepStrip";
import type { TimeQuestion as TQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: TQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

const TIME_STEPS = [
  "Look at the short hand (hour)",
  "Look at the long hand (minutes)",
  "Read the time",
];

function handCoords(
  cx: number,
  cy: number,
  length: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + length * Math.cos(rad),
    y: cy + length * Math.sin(rad),
  };
}

export default function TimeQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { hour, minute, answer } = question;
  const cx = 100;
  const cy = 100;

  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;

  const hourTip = handCoords(cx, cy, 52, hourAngle);
  const minuteTip = handCoords(cx, cy, 72, minuteAngle);

  const tickMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30;
    const outer = handCoords(cx, cy, 86, angle);
    const inner = handCoords(cx, cy, 76, angle);
    return { outer, inner, angle };
  });

  const hourLabels = Array.from({ length: 12 }, (_, i) => {
    const h = i + 1;
    const angle = h * 30;
    const pos = handCoords(cx, cy, 65, angle);
    return { h, pos };
  });

  return (
    <div className="flex flex-col items-center pt-6">
      <StepStrip
        steps={TIME_STEPS}
        accent={colors.accent}
        border={colors.border}
        bg={colors.bg}
      />

      <p className="text-sm mb-4" style={{ color: "oklch(0.50 0.02 60)" }}>
        What time does this clock show?
      </p>

      <svg
        viewBox="0 0 200 200"
        width={200}
        height={200}
        aria-label={`Analog clock showing ${answer}`}
        role="img"
      >
        <title>Analog clock showing {answer}</title>
        <defs>
          <marker
            id="arrow-min"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="oklch(0.45 0.22 150)" />
          </marker>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={90}
          fill="oklch(1 0 0)"
          stroke={colors.border}
          strokeWidth={1.5}
        />

        {tickMarks.map((tick) => (
          <line
            key={`tick-${tick.angle}`}
            x1={tick.inner.x}
            y1={tick.inner.y}
            x2={tick.outer.x}
            y2={tick.outer.y}
            stroke="oklch(0.75 0.01 70)"
            strokeWidth={1.5}
          />
        ))}

        {hourLabels.map(({ h, pos }) => (
          <text
            key={`hour-${h}`}
            x={pos.x}
            y={pos.y + 4}
            textAnchor="middle"
            fontSize={11}
            fill="oklch(0.35 0.02 55)"
            fontFamily="Figtree, sans-serif"
          >
            {h}
          </text>
        ))}

        <line
          x1={cx}
          y1={cy}
          x2={hourTip.x}
          y2={hourTip.y}
          stroke="oklch(0.18 0.03 260)"
          strokeWidth={6}
          strokeLinecap="round"
        />

        <line
          x1={cx}
          y1={cy}
          x2={minuteTip.x}
          y2={minuteTip.y}
          stroke="oklch(0.45 0.22 150)"
          strokeWidth={2}
          strokeLinecap="round"
          markerEnd="url(#arrow-min)"
        />

        <circle cx={cx} cy={cy} r={3} fill="oklch(0.18 0.03 260)" />
      </svg>

      {/* Hand legend */}
      <div
        className="flex items-center gap-5 mt-3 mb-2"
        style={{
          fontFamily: "Figtree, sans-serif",
          fontSize: "0.75rem",
          color: "oklch(0.50 0.02 60)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              backgroundColor: "oklch(0.18 0.03 260)",
              flexShrink: 0,
            }}
          />
          <span>Short = hour</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              backgroundColor: "oklch(0.45 0.22 150)",
              flexShrink: 0,
            }}
          />
          <span>Long = minutes</span>
        </div>
      </div>

      <AnswerButtons
        choices={question.choices}
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
