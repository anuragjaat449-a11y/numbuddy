import { useContext, useEffect, useRef, useState } from "react";
import type { GameState } from "../App";
import { SoundContext } from "../context/SoundContext";
import ArithMultiplyQuestion from "../modules/ArithMultiplyQuestion";
import ArithQuestion from "../modules/ArithQuestion";
import ArithScaffoldQuestion from "../modules/ArithScaffoldQuestion";
import EstimationQuestion from "../modules/EstimationQuestion";
import FractionsQuestion from "../modules/FractionsQuestion";
import GroupingQuestion from "../modules/GroupingQuestion";
import MagnitudeQuestion from "../modules/MagnitudeQuestion";
import MeasurementQuestion from "../modules/MeasurementQuestion";
import MoneyBillsQuestion from "../modules/MoneyBillsQuestion";
import MoneyChangeQuestion from "../modules/MoneyChangeQuestion";
import MoneyQuestion from "../modules/MoneyQuestion";
import MoneyReceiptQuestion from "../modules/MoneyReceiptQuestion";
import NumberLineQuestion from "../modules/NumberLineQuestion";
import NumberQuestion from "../modules/NumberQuestion";
import NumberSenseTextQuestion from "../modules/NumberSenseTextQuestion";
import OddEvenQuestion from "../modules/OddEvenQuestion";
import PlaceValueQuestion from "../modules/PlaceValueQuestion";
import SequenceQuestion from "../modules/SequenceQuestion";
import StepSeqQuestion from "../modules/StepSeqQuestion";
import TimeCalendarQuestion from "../modules/TimeCalendarQuestion";
import TimeElapsedQuestion from "../modules/TimeElapsedQuestion";
import TimeQuestion from "../modules/TimeQuestion";
import TimeScheduleQuestion from "../modules/TimeScheduleQuestion";

interface Props {
  state: GameState;
  onAnswer: (correct: boolean) => void;
  onAdvance: () => void;
  onBack: () => void;
  onResult: () => void;
}

const MODULE_COLORS: Record<
  string,
  { accent: string; bg: string; border: string }
> = {
  number: {
    accent: "oklch(0.55 0.18 280)",
    bg: "oklch(0.95 0.04 280)",
    border: "oklch(0.82 0.08 280)",
  },
  arith: {
    accent: "oklch(0.52 0.15 160)",
    bg: "oklch(0.94 0.04 160)",
    border: "oklch(0.80 0.08 160)",
  },
  money: {
    accent: "oklch(0.60 0.14 75)",
    bg: "oklch(0.96 0.05 85)",
    border: "oklch(0.84 0.10 80)",
  },
  time: {
    accent: "oklch(0.50 0.13 220)",
    bg: "oklch(0.94 0.04 220)",
    border: "oklch(0.80 0.08 220)",
  },
  sequence: {
    accent: "oklch(0.58 0.15 55)",
    bg: "oklch(0.96 0.05 60)",
    border: "oklch(0.84 0.10 58)",
  },
  numberline: {
    accent: "oklch(0.52 0.16 330)",
    bg: "oklch(0.95 0.04 330)",
    border: "oklch(0.82 0.08 330)",
  },
  estimation: {
    accent: "oklch(0.55 0.14 195)",
    bg: "oklch(0.94 0.05 195)",
    border: "oklch(0.80 0.09 195)",
  },
  stepseq: {
    accent: "oklch(0.52 0.15 175)",
    bg: "oklch(0.94 0.05 175)",
    border: "oklch(0.80 0.09 175)",
  },
  fractions: {
    accent: "oklch(0.52 0.15 130)",
    bg: "oklch(0.94 0.04 130)",
    border: "oklch(0.80 0.09 130)",
  },
  measurement: {
    accent: "oklch(0.52 0.14 210)",
    bg: "oklch(0.94 0.04 210)",
    border: "oklch(0.80 0.09 210)",
  },
};

const EFFORT_MESSAGES = [
  "You're sticking with it — that's what matters.",
  "Trying is how we learn.",
  "That took courage to try.",
  "Every attempt builds your brain.",
  "You showed up — that counts.",
  "Wrong answers are part of learning.",
  "Keep going. You're building something.",
  "That's one more try toward understanding.",
];

const CORRECT_MESSAGES = [
  "Great job!",
  "You got it!",
  "Nice work!",
  "That's right!",
  "Well done!",
];

const DOT_POSITIONS = [1, 2, 3, 4, 5];

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

function SpeakerOnIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M2 5.5h2l4-3v11l-4-3H2V5.5z" fill="currentColor" opacity="0.9" />
      <path
        d="M11 4.5c1.5 0.8 2.5 2.2 2.5 3.5s-1 2.7-2.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12.5 2.5c2.2 1.3 3.5 3.1 3.5 5.5s-1.3 4.2-3.5 5.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M2 5.5h2l4-3v11l-4-3H2V5.5z" fill="currentColor" opacity="0.4" />
      <line
        x1="10"
        y1="5"
        x2="15"
        y2="11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="15"
        y1="5"
        x2="10"
        y2="11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function GameScreen({
  state,
  onAnswer,
  onAdvance,
  onBack,
  onResult,
}: Props) {
  const { catId, round, q, answered, difficulty } = state;
  const colors = MODULE_COLORS[catId] ?? MODULE_COLORS.number;
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [correctIdx, setCorrectIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const advanceRef = useRef(onAdvance);
  const onResultRef = useRef(onResult);
  const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  advanceRef.current = onAdvance;
  onResultRef.current = onResult;

  const { muted, toggleMute, playCorrect, playIncorrect } =
    useContext(SoundContext);

  const prevRound = useRef(round);
  useEffect(() => {
    if (prevRound.current !== round) {
      setSelectedIdx(null);
      setCorrectIdx(null);
      setFeedback(null);
      setFeedbackCorrect(false);
      setConfirmExit(false);
      prevRound.current = round;
    }
  }, [round]);

  const handleChoice = (
    idx: number,
    isCorrect: boolean,
    correctIndex: number,
  ) => {
    if (answered) return;
    setSelectedIdx(idx);
    setCorrectIdx(correctIndex);
    if (isCorrect) {
      const msg =
        CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
      setFeedback(msg);
      setFeedbackCorrect(true);
      playCorrect();
    } else {
      const msg =
        EFFORT_MESSAGES[Math.floor(Math.random() * EFFORT_MESSAGES.length)];
      setFeedback(msg);
      setFeedbackCorrect(false);
      playIncorrect();
    }
    onAnswer(isCorrect);
    if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
    answerTimerRef.current = setTimeout(() => {
      advanceRef.current();
    }, 1600);
  };

  const renderQuestion = () => {
    switch (q.type) {
      case "number":
        return (
          <NumberQuestion
            key={`number-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "magnitude":
        return (
          <MagnitudeQuestion
            key={`magnitude-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "grouping":
        return (
          <GroupingQuestion
            key={`grouping-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "odd_even":
        return (
          <OddEvenQuestion
            key={`odd_even-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "arith":
        return (
          <ArithQuestion
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "arith_scaffold":
        return (
          <ArithScaffoldQuestion
            key={`arith_scaffold-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "arith_multiply":
        return (
          <ArithMultiplyQuestion
            key={`arith_multiply-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "money":
        return (
          <MoneyQuestion
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "money_bills":
        return (
          <MoneyBillsQuestion
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "money_change":
        return (
          <MoneyChangeQuestion
            key={`money_change-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "money_receipt":
        return (
          <MoneyReceiptQuestion
            key={`money_receipt-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "time":
        return (
          <TimeQuestion
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "time_calendar":
        return (
          <TimeCalendarQuestion
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "time_elapsed":
        return (
          <TimeElapsedQuestion
            key={`time_elapsed-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "sequence":
        return (
          <SequenceQuestion
            key={`sequence-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "placevalue":
        return (
          <PlaceValueQuestion
            key={`placevalue-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "numberline":
      case "numberline_halfway":
      case "numberline_closer":
      case "numberline_hops":
        return (
          <NumberLineQuestion
            key={`${q.type}-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "estimation":
        return (
          <EstimationQuestion
            key={`estimation-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "stepseq":
        return (
          <StepSeqQuestion
            key={`stepseq-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "fractions":
        return (
          <FractionsQuestion
            key={`fractions-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "measurement":
        return (
          <MeasurementQuestion
            key={`measurement-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "number_sense_text":
        return (
          <NumberSenseTextQuestion
            key={`number_sense_text-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      case "time_schedule":
        return (
          <TimeScheduleQuestion
            key={`time_schedule-${round}`}
            question={q}
            answered={answered}
            selectedIdx={selectedIdx}
            correctIdx={correctIdx}
            colors={colors}
            onChoice={handleChoice}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 pt-5 pb-3 max-w-2xl md:max-w-3xl mx-auto w-full">
        {confirmExit ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm" style={{ color: "oklch(0.40 0.02 55)" }}>
              Leave this session? Your progress won't be saved.
            </span>
            <button
              type="button"
              data-ocid="game.exit_confirm_button"
              onClick={() => {
                if (answerTimerRef.current)
                  clearTimeout(answerTimerRef.current);
                onBack();
              }}
              className="text-sm px-3 py-1.5 rounded-md border font-medium transition-colors min-h-[36px]"
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
              data-ocid="game.exit_cancel_button"
              onClick={() => setConfirmExit(false)}
              className="text-sm px-3 py-1.5 rounded-md border transition-colors min-h-[36px]"
              style={{
                borderColor: colors.border,
                color: colors.accent,
                backgroundColor: "transparent",
              }}
            >
              Stay
            </button>
          </div>
        ) : (
          <button
            type="button"
            data-ocid="game.back_button"
            onClick={() => setConfirmExit(true)}
            className="text-sm px-3 py-2 md:py-2.5 rounded-md border transition-colors min-h-[40px] md:min-h-[44px]"
            style={{
              borderColor: colors.border,
              color: colors.accent,
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                colors.bg;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            ← Back
          </button>
        )}

        <div className="flex gap-2 items-center">
          {DOT_POSITIONS.map((pos) => {
            const i = pos - 1;
            return (
              <div
                key={`progress-${pos}`}
                className="progress-dot"
                style={{
                  borderColor: colors.accent,
                  backgroundColor:
                    i < round - 1
                      ? colors.accent
                      : i === round - 1
                        ? colors.bg
                        : "transparent",
                }}
              />
            );
          })}
        </div>

        <div className="flex gap-2 items-center">
          <button
            type="button"
            data-ocid="game.sound_toggle"
            onClick={toggleMute}
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            className="w-8 h-8 flex items-center justify-center rounded-full border transition-colors"
            style={{
              borderColor: muted ? "oklch(0.88 0.01 60)" : colors.border,
              color: muted ? "oklch(0.70 0.01 60)" : colors.accent,
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                muted ? "oklch(0.95 0.005 60)" : colors.bg;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            {muted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
          </button>

          <div
            className="text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: colors.bg,
              color: colors.accent,
              border: `1px solid ${colors.border}`,
            }}
          >
            {DIFFICULTY_LABELS[difficulty]}
          </div>
        </div>
      </header>

      <output aria-live="polite" aria-atomic="true" className="sr-only">
        {answered
          ? feedbackCorrect
            ? "Correct!"
            : "Incorrect. Keep going, you can do it."
          : ""}
      </output>
      <main className="flex-1 max-w-2xl md:max-w-3xl mx-auto w-full px-4 pb-8 flex flex-col">
        {renderQuestion()}

        <div className="mt-4 min-h-8 text-center">
          {feedback && (
            <p
              className="text-sm font-medium"
              style={{
                color: feedbackCorrect
                  ? "oklch(0.50 0.15 155)"
                  : "oklch(0.52 0.10 55)",
              }}
            >
              {feedback}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
