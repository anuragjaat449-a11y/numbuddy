import type { FractionsQuestion as FQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: FQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

export default function FractionsQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const correctIndex = question.choices.indexOf(
    question.choices[question.answer],
  );

  return (
    <div className="flex flex-col items-center pt-4">
      <p
        className="text-base md:text-lg font-medium mb-5 text-center"
        style={{ color: "oklch(0.22 0.02 55)" }}
      >
        {question.prompt}
      </p>

      {question.svgB ? (
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-2 w-full">
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-sm font-semibold"
              style={{ color: colors.accent }}
            >
              {question.labelA ?? "First"}
            </span>
            <div
              className="rounded-xl p-3"
              style={{ backgroundColor: colors.bg }}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG generated server-side with controlled inputs
              dangerouslySetInnerHTML={{ __html: question.svgA }}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-sm font-semibold"
              style={{ color: colors.accent }}
            >
              {question.labelB ?? "Second"}
            </span>
            <div
              className="rounded-xl p-3"
              style={{ backgroundColor: colors.bg }}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG generated server-side with controlled inputs
              dangerouslySetInnerHTML={{ __html: question.svgB }}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Fraction tip card for identify-type questions */}
          <div
            className="rounded-xl border px-4 py-3 mb-4 w-full max-w-xs"
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
              fontFamily: "Figtree, sans-serif",
            }}
          >
            <div
              className="text-xs mb-1"
              style={{ color: "oklch(0.40 0.02 55)" }}
            >
              <span style={{ fontWeight: 700 }}>Top number</span> = shaded parts
            </div>
            <div className="text-xs" style={{ color: "oklch(0.40 0.02 55)" }}>
              <span style={{ fontWeight: 700 }}>Bottom number</span> = total
              parts
            </div>
          </div>

          <div
            className="rounded-xl p-3 mb-2"
            style={{ backgroundColor: colors.bg }}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG generated server-side with controlled inputs
            dangerouslySetInnerHTML={{ __html: question.svgA }}
          />
        </>
      )}

      {answered && (
        <p
          className="text-sm mt-4 px-4 text-center"
          style={{ color: "oklch(0.40 0.10 130)" }}
        >
          {question.explanation}
        </p>
      )}

      <AnswerButtons
        choices={question.choices}
        correctValue={question.choices[correctIndex]}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
      />
    </div>
  );
}
