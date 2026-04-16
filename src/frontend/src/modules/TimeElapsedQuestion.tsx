import type { TimeElapsedQuestion as TEQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: TEQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

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

function ClockSVG({
  hour,
  minute,
  colors,
}: {
  hour: number;
  minute: number;
  colors: { accent: string; bg: string; border: string };
}) {
  const cx = 60;
  const cy = 60;
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  const hourTip = handCoords(cx, cy, 32, hourAngle);
  const minuteTip = handCoords(cx, cy, 44, minuteAngle);

  const tickMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30;
    const outer = handCoords(cx, cy, 52, angle);
    const inner = handCoords(cx, cy, 46, angle);
    return { outer, inner, angle };
  });

  return (
    <svg
      viewBox="0 0 120 120"
      width={120}
      height={120}
      role="img"
      aria-label={`Clock showing ${hour}:${minute.toString().padStart(2, "0")}`}
    >
      <title>
        Clock showing {hour}:{minute.toString().padStart(2, "0")}
      </title>
      <defs>
        <marker
          id="arrow-min-elapsed"
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
        r={54}
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
        markerEnd="url(#arrow-min-elapsed)"
      />
      <circle cx={cx} cy={cy} r={3} fill="oklch(0.18 0.03 260)" />
    </svg>
  );
}

export default function TimeElapsedQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { startHour, startMinute, elapsedMinutes, answer, choices } = question;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center pt-4">
      <p className="text-sm mb-1" style={{ color: "oklch(0.50 0.02 60)" }}>
        The clock shows:
      </p>
      <p
        className="text-2xl font-medium mb-4"
        style={{
          fontFamily: "Space Grotesk, system-ui, sans-serif",
          color: "oklch(0.22 0.02 55)",
        }}
      >
        {startHour}:{pad(startMinute)}
      </p>

      <div
        className="rounded-xl p-4 mb-2"
        style={{ backgroundColor: colors.bg }}
      >
        <ClockSVG hour={startHour} minute={startMinute} colors={colors} />
      </div>

      {/* Hand legend */}
      <div
        className="flex items-center gap-5 mb-4"
        style={{
          fontFamily: "Figtree, sans-serif",
          fontSize: "0.75rem",
          color: "oklch(0.50 0.02 60)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: "oklch(0.18 0.03 260)",
              flexShrink: 0,
            }}
          />
          <span>Short = hour</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: "oklch(0.45 0.22 150)",
              flexShrink: 0,
            }}
          />
          <span>Long = minutes</span>
        </div>
      </div>

      <p
        className="text-base md:text-lg font-medium text-center mb-2"
        style={{ color: "oklch(0.22 0.02 55)" }}
      >
        {elapsedMinutes} minutes later, what time is it?
      </p>

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
