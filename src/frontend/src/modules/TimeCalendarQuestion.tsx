import type { TimeCalendarQuestion as TCQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: TCQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TimeCalendarQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { monthName, startDay, endDay, answer } = question;

  // Build a simple strip of 14 days around the range
  const firstShown = Math.max(1, startDay - 3);
  const lastShown = Math.min(firstShown + 13, endDay + 3);
  const days: number[] = [];
  for (let d = firstShown; d <= lastShown; d++) days.push(d);

  const cellSize = 36;
  const cols = 7;
  const rows = Math.ceil(days.length / cols);
  const svgW = cols * cellSize + (cols - 1) * 2;
  const svgH = rows * cellSize + (rows - 1) * 2 + 24; // +24 for day labels

  return (
    <div className="flex flex-col items-center pt-6">
      <p
        className="text-sm md:text-base mb-2"
        style={{ color: "oklch(0.50 0.02 60)" }}
      >
        {monthName}
      </p>
      <p
        className="text-sm md:text-base mb-4 font-medium"
        style={{ color: "oklch(0.30 0.02 55)" }}
      >
        How many days from day {startDay} to day {endDay}?
      </p>

      <div className="mb-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          width={Math.min(svgW * 1.2, 340)}
          height={Math.min(svgH * 1.2, 160)}
          style={{ maxWidth: "100%" }}
          aria-label={`Calendar showing days ${startDay} through ${endDay} in ${monthName}`}
          role="img"
        >
          <title>
            Calendar: {monthName}, days {startDay} to {endDay}
          </title>

          {/* Day headers */}
          {DAY_LABELS.map((label, i) => (
            <text
              key={`header-${label}`}
              x={i * (cellSize + 2) + cellSize / 2}
              y={14}
              textAnchor="middle"
              fontSize={9}
              fill="oklch(0.60 0.01 70)"
              fontFamily="Figtree, sans-serif"
            >
              {label}
            </text>
          ))}

          {/* Day cells */}
          {days.map((day, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            const x = col * (cellSize + 2);
            const y = row * (cellSize + 2) + 20;
            const isStart = day === startDay;
            const isEnd = day === endDay;
            const isInRange = day >= startDay && day <= endDay;

            let fill = "oklch(1 0 0)";
            let textFill = "oklch(0.35 0.02 55)";
            let stroke = "oklch(0.90 0.01 70)";
            let strokeW = 0.5;

            if (isStart || isEnd) {
              fill = colors.accent;
              textFill = "oklch(1 0 0)";
              stroke = colors.accent;
              strokeW = 0;
            } else if (isInRange) {
              fill = colors.bg;
              textFill = colors.accent;
              stroke = colors.border;
            }

            return (
              <g key={`day-${day}`}>
                <rect
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  rx={4}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeW}
                />
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2 + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={isStart || isEnd ? 700 : 400}
                  fill={textFill}
                  fontFamily="Figtree, sans-serif"
                >
                  {day}
                </text>
              </g>
            );
          })}
        </svg>
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
