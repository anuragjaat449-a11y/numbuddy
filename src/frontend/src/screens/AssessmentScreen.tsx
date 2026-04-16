import { useMemo, useRef, useState } from "react";
import type { CatId } from "../App";
import type { QuestionData } from "../game/questions";
import { generateQuestion, makeEstimationQuestion } from "../game/questions";
import ArithQuestion from "../modules/ArithQuestion";
import EstimationQuestion from "../modules/EstimationQuestion";
import MagnitudeQuestion from "../modules/MagnitudeQuestion";
import NumberLineQuestion from "../modules/NumberLineQuestion";
import NumberQuestion from "../modules/NumberQuestion";
import NumberSenseTextQuestion from "../modules/NumberSenseTextQuestion";
import OddEvenQuestion from "../modules/OddEvenQuestion";
import PlaceValueQuestion from "../modules/PlaceValueQuestion";
import SequenceQuestion from "../modules/SequenceQuestion";
import TimeQuestion from "../modules/TimeQuestion";
import TimeScheduleQuestion from "../modules/TimeScheduleQuestion";

interface Props {
  onHome: () => void;
  onStartModule: (catId: CatId) => void;
}

const ASSESS_COLORS = {
  accent: "oklch(0.55 0.14 195)",
  bg: "oklch(0.94 0.05 195)",
  border: "oklch(0.80 0.09 195)",
};

interface AreaDef {
  name: string;
  questionIndices: number[];
  primaryModule: Exclude<CatId, "calm">;
  description: string;
}

const AREAS: AreaDef[] = [
  {
    name: "Counting & Subitizing",
    questionIndices: [0, 1, 11],
    primaryModule: "number",
    description: "Quickly recognizing and comparing quantities",
  },
  {
    name: "Number Relationships",
    questionIndices: [2, 3, 4, 8],
    primaryModule: "numberline",
    description: "Understanding how numbers relate and where they sit",
  },
  {
    name: "Calculation",
    questionIndices: [5, 6, 7],
    primaryModule: "arith",
    description: "Working through arithmetic and place value",
  },
  {
    name: "Time & Estimation",
    questionIndices: [9, 10],
    primaryModule: "time",
    description: "Reading time and judging quantities",
  },
];

function makeMagnitudeQ(): QuestionData {
  let a: number;
  let b: number;
  do {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
  } while (Math.abs(a - b) < 2 || a === b);
  return {
    type: "magnitude",
    a,
    b,
    answer: a > b ? "a" : "b",
  };
}

function generateAssessmentQuestions(): QuestionData[] {
  return [
    generateQuestion("number", "easy"), // 0
    generateQuestion("number", "easy"), // 1
    generateQuestion("number", "easy"), // 2
    makeMagnitudeQ(), // 3
    generateQuestion("numberline", "easy"), // 4
    generateQuestion("arith", "easy"), // 5
    generateQuestion("arith", "medium"), // 6
    generateQuestion("sequence", "easy"), // 7
    generateQuestion("sequence", "easy"), // 8
    generateQuestion("time", "easy"), // 9
    makeEstimationQuestion("easy"), // 10
    generateQuestion("number", "easy"), // 11
  ];
}

const MODULE_NAMES: Record<string, string> = {
  number: "Number Sense",
  arith: "Arithmetic",
  money: "Money & Real Life",
  time: "Time & Scheduling",
  sequence: "Counting & Sequences",
  numberline: "Number Line",
  estimation: "Estimation",
  stepseq: "Step-by-Step Sequencing",
  fractions: "Fractions",
  measurement: "Measurement",
};

type Phase = "questions" | "results";

export default function AssessmentScreen({ onHome, onStartModule }: Props) {
  const questions = useMemo(() => generateAssessmentQuestions(), []);
  const [phase, setPhase] = useState<Phase>("questions");
  const [currentQ, setCurrentQ] = useState(0);
  const [responses, setResponses] = useState<boolean[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const answeredRef = useRef(false);

  const handleChoice = (_idx: number, isCorrect: boolean) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    const newResponses = [...responses, isCorrect];
    setResponses(newResponses);
    if (currentQ + 1 >= questions.length) {
      localStorage.setItem(
        "brainwarmup_assessment",
        JSON.stringify({
          responses: newResponses,
          date: new Date().toISOString(),
        }),
      );
      setPhase("results");
    } else {
      // Reset before advancing — safe since re-render is batched
      answeredRef.current = false;
      setCurrentQ((q) => q + 1);
    }
  };

  const renderQuestion = (q: QuestionData) => {
    const commonProps = {
      answered: false as const,
      selectedIdx: null,
      correctIdx: null,
      colors: ASSESS_COLORS,
      onChoice: handleChoice,
    };
    switch (q.type) {
      case "number":
        return (
          <NumberQuestion
            key={`aq-${currentQ}`}
            question={q}
            {...commonProps}
          />
        );
      case "magnitude":
        return (
          <MagnitudeQuestion
            key={`aq-${currentQ}`}
            question={q}
            {...commonProps}
          />
        );
      case "numberline":
        return (
          <NumberLineQuestion
            key={`aq-${currentQ}`}
            question={q}
            {...commonProps}
          />
        );
      case "arith":
        return (
          <ArithQuestion key={`aq-${currentQ}`} question={q} {...commonProps} />
        );
      case "arith_scaffold":
        return (
          <ArithQuestion
            key={`aq-${currentQ}`}
            question={{
              type: "arith",
              op: q.op,
              a: q.a,
              b: q.b,
              answer: q.answer,
              choices: q.choices,
            }}
            {...commonProps}
          />
        );
      case "placevalue":
        return (
          <PlaceValueQuestion
            key={`aq-${currentQ}`}
            question={q}
            {...commonProps}
          />
        );
      case "sequence":
        return (
          <SequenceQuestion
            key={`aq-${currentQ}`}
            question={q}
            {...commonProps}
          />
        );
      case "time":
        return (
          <TimeQuestion key={`aq-${currentQ}`} question={q} {...commonProps} />
        );
      case "time_calendar":
        return (
          <TimeQuestion
            key={`aq-${currentQ}`}
            question={{
              type: "time",
              hour: 1,
              minute: 0,
              answer: "1:00",
              choices: ["1:00", "2:00", "3:00", "4:00"],
            }}
            {...commonProps}
          />
        );
      case "estimation":
        return (
          <EstimationQuestion
            key={`aq-${currentQ}`}
            question={q}
            {...commonProps}
          />
        );
      case "odd_even":
        return (
          <OddEvenQuestion
            key={`aq-${currentQ}`}
            question={q}
            {...commonProps}
          />
        );
      case "number_sense_text":
        return (
          <NumberSenseTextQuestion
            key={`aq-${currentQ}`}
            question={q}
            {...commonProps}
          />
        );
      case "time_schedule":
        return (
          <TimeScheduleQuestion
            key={`aq-${currentQ}`}
            question={q}
            {...commonProps}
          />
        );
      default:
        return (
          <div
            key={`aq-${currentQ}`}
            className="py-8 text-center"
            style={{ color: "oklch(0.50 0.02 60)" }}
          >
            Question {currentQ + 1}
          </div>
        );
    }
  };

  if (phase === "results") {
    return (
      <AssessmentResults
        responses={responses}
        onHome={onHome}
        onStartModule={onStartModule}
      />
    );
  }

  const progress = Math.round(((currentQ + 1) / questions.length) * 100);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 pt-5 pb-3 max-w-2xl mx-auto w-full">
        <div>
          <h1
            className="text-sm font-medium"
            style={{
              color: "oklch(0.40 0.10 195)",
              fontFamily: "Fraunces, Georgia, serif",
            }}
          >
            Assessment
          </h1>
          <p className="text-xs" style={{ color: "oklch(0.60 0.02 60)" }}>
            Question {currentQ + 1} of {questions.length}
          </p>
        </div>
        {showExitConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "oklch(0.40 0.02 55)" }}>
              Leave assessment?
            </span>
            <button
              type="button"
              data-ocid="assessment.confirm_button"
              onClick={onHome}
              className="text-xs px-2.5 py-1.5 rounded-md border font-medium transition-colors"
              style={{
                borderColor: "oklch(0.72 0.14 25)",
                color: "oklch(0.45 0.18 25)",
                backgroundColor: "oklch(0.96 0.04 25)",
              }}
            >
              Leave
            </button>
            <button
              type="button"
              data-ocid="assessment.cancel_button"
              onClick={() => setShowExitConfirm(false)}
              className="text-xs px-2.5 py-1.5 rounded-md border transition-colors"
              style={{
                borderColor: ASSESS_COLORS.border,
                color: "oklch(0.50 0.02 60)",
                backgroundColor: "transparent",
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            data-ocid="assessment.close_button"
            onClick={() => (currentQ > 0 ? setShowExitConfirm(true) : onHome())}
            className="text-xs px-3 py-1.5 rounded-full border transition-colors"
            style={{
              borderColor: ASSESS_COLORS.border,
              color: "oklch(0.50 0.02 60)",
              backgroundColor: "transparent",
            }}
          >
            Exit
          </button>
        )}
      </header>

      {/* Progress bar */}
      <div
        className="mx-4 md:mx-auto max-w-2xl w-full md:w-[calc(100%-2rem)] h-1.5 rounded-full mb-2"
        style={{ backgroundColor: "oklch(0.91 0.02 195)" }}
        data-ocid="assessment.loading_state"
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: ASSESS_COLORS.accent,
          }}
        />
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-8 flex flex-col">
        <div key={`assess-container-${currentQ}`}>
          {renderQuestion(questions[currentQ])}
        </div>

        <div className="mt-auto pt-6 text-center">
          <p className="text-xs" style={{ color: "oklch(0.65 0.02 60)" }}>
            Finding it overwhelming?{" "}
            <button
              type="button"
              data-ocid="assessment.cancel_button"
              onClick={onHome}
              className="underline underline-offset-2"
              style={{ color: "oklch(0.55 0.10 195)" }}
            >
              Take a break
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

function AssessmentResults({
  responses,
  onHome,
  onStartModule,
}: {
  responses: boolean[];
  onHome: () => void;
  onStartModule: (catId: CatId) => void;
}) {
  const areaScores = AREAS.map((area) => {
    const total = area.questionIndices.length;
    const correct = area.questionIndices.filter(
      (i) => responses[i] === true,
    ).length;
    const pct = total > 0 ? correct / total : 0;
    return { ...area, correct, total, pct };
  });

  const sorted = [...areaScores].sort((a, b) => a.pct - b.pct);
  const recommended = sorted.slice(0, Math.min(3, sorted.length));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 pt-8 pb-4 max-w-2xl mx-auto w-full">
        <button
          type="button"
          data-ocid="assessment.results.close_button"
          onClick={onHome}
          className="text-xs px-3 py-1.5 rounded-full border transition-colors mb-4"
          style={{
            borderColor: ASSESS_COLORS.border,
            color: "oklch(0.50 0.02 60)",
            backgroundColor: "transparent",
          }}
        >
          Back to home
        </button>
        <h1
          className="text-2xl md:text-3xl font-medium"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            color: "oklch(0.22 0.02 55)",
          }}
        >
          Assessment Complete
        </h1>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-10">
        <div
          className="flex flex-col gap-4 mb-8"
          data-ocid="assessment.results.list"
        >
          {areaScores.map((area, idx) => (
            <div
              key={area.name}
              className="rounded-xl p-5"
              data-ocid={`assessment.results.item.${idx + 1}`}
              style={{
                backgroundColor: "oklch(1 0 0)",
                border: "1px solid oklch(0.88 0.03 55)",
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.22 0.02 55)" }}
                >
                  {area.name}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.02 60)" }}
                >
                  {area.correct} of {area.total}
                </span>
              </div>
              <p
                className="text-xs mb-3"
                style={{ color: "oklch(0.60 0.02 60)" }}
              >
                {area.description}
              </p>
              <div
                className="h-2 rounded-full"
                style={{ backgroundColor: "oklch(0.91 0.03 195)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(area.pct * 100)}%`,
                    backgroundColor:
                      area.pct >= 0.67
                        ? "oklch(0.52 0.15 160)"
                        : area.pct >= 0.34
                          ? "oklch(0.60 0.14 75)"
                          : "oklch(0.55 0.14 195)",
                  }}
                />
              </div>
              <p
                className="text-xs mt-2"
                style={{
                  color:
                    area.pct >= 0.67
                      ? "oklch(0.45 0.12 160)"
                      : "oklch(0.45 0.10 195)",
                }}
              >
                {area.pct >= 0.67
                  ? "This is a strong area for you — keep it up."
                  : area.pct >= 0.34
                    ? "This is a good area to build on."
                    : "This is a great place to start practicing."}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-5 mb-6"
          style={{
            backgroundColor: "oklch(0.94 0.05 195)",
            border: "1px solid oklch(0.80 0.09 195)",
          }}
        >
          <h2
            className="text-sm font-medium uppercase tracking-wider mb-4"
            style={{ color: "oklch(0.45 0.12 195)" }}
          >
            Recommended starting points
          </h2>
          <div className="flex flex-col gap-2">
            {recommended.map((area, idx) => (
              <button
                key={area.primaryModule}
                type="button"
                data-ocid={`assessment.results.primary_button.${idx + 1}`}
                onClick={() => onStartModule(area.primaryModule)}
                className="w-full text-left py-3 px-4 rounded-lg transition-colors"
                style={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.80 0.09 195)",
                  color: "oklch(0.22 0.02 55)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "oklch(0.97 0.03 195)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "oklch(1 0 0)";
                }}
              >
                <span
                  className="text-xs font-medium uppercase tracking-wider block mb-0.5"
                  style={{ color: "oklch(0.55 0.14 195)" }}
                >
                  Start here
                </span>
                <span className="text-sm font-medium">
                  {MODULE_NAMES[area.primaryModule] ?? area.primaryModule}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          data-ocid="assessment.results.secondary_button"
          onClick={onHome}
          className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
          style={{
            backgroundColor: "transparent",
            border: "1px solid oklch(0.85 0.03 55)",
            color: "oklch(0.50 0.02 60)",
          }}
        >
          Explore all modules
        </button>
      </main>
    </div>
  );
}
