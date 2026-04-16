import type { GroupingQuestion as GQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: GQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

function DotGroup({
  count,
  color,
  size = 100,
}: { count: number; color: string; size?: number }) {
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const dotR = Math.min(12, Math.floor((size * 0.8) / (cols * 2 + 1)));
  const spacing = (size - dotR * 2) / (cols + 1);
  const vspacing = (size - dotR * 2) / (rows + 1);

  const dots: { x: number; y: number; key: string }[] = [];
  let placed = 0;
  for (let r = 0; r < rows && placed < count; r++) {
    for (let c = 0; c < cols && placed < count; c++) {
      dots.push({
        x: spacing * (c + 1) + dotR,
        y: vspacing * (r + 1) + dotR,
        key: `dot-r${r}-c${c}`,
      });
      placed++;
    }
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <title>{count} dots</title>
      {dots.map((d) => (
        <circle key={d.key} cx={d.x} cy={d.y} r={dotR} fill={color} />
      ))}
    </svg>
  );
}

export default function GroupingQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const { groupA, groupB, total } = question;

  return (
    <div className="flex flex-col items-center pt-6">
      <p
        className="text-sm md:text-base mb-6"
        style={{ color: "oklch(0.50 0.02 60)" }}
      >
        How many altogether?
      </p>

      <div className="flex items-center gap-3 md:gap-6 mb-6">
        <div
          className="rounded-xl border p-2"
          style={{ borderColor: colors.border, backgroundColor: colors.bg }}
        >
          <DotGroup count={groupA} color={colors.accent} />
        </div>
        <span
          className="text-3xl md:text-4xl font-medium"
          style={{ color: "oklch(0.50 0.02 60)" }}
        >
          +
        </span>
        <div
          className="rounded-xl border p-2"
          style={{ borderColor: colors.border, backgroundColor: colors.bg }}
        >
          <DotGroup count={groupB} color={colors.accent} />
        </div>
      </div>

      <AnswerButtons
        choices={question.choices}
        correctValue={total}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
      />
    </div>
  );
}
