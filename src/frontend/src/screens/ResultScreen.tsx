import { useContext, useEffect, useMemo, useRef } from "react";
import type { GameState } from "../App";
import { SoundContext } from "../context/SoundContext";

interface Props {
  state: GameState;
  onTryAgain: () => void;
  onHome: () => void;
}

const EFFORT_CLOSING_MESSAGES = [
  "You showed up and tried. That's the hardest part.",
  "5 questions attempted. That's 5 moments of courage.",
  "Persistence is a skill. You practiced it today.",
  "Every session makes the next one easier.",
  "Trying, even when it's hard, is real learning.",
  "You kept going. That's what growth looks like.",
];

function LeafIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path
        d="M10 2C10 2 4 5 4 11C4 14.3137 6.68629 17 10 17C13.3137 17 16 14.3137 16 11C16 5 10 2 10 2Z"
        fill="oklch(0.72 0.10 145)"
      />
      <line
        x1="10"
        y1="17"
        x2="10"
        y2="19"
        stroke="oklch(0.60 0.08 145)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="6"
        x2="10"
        y2="15"
        stroke="oklch(0.55 0.06 145)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

function StarIcon({ color }: { color: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M24 4L29.09 16.26L42.36 17.27L32.73 25.59L35.82 38.73L24 31.77L12.18 38.73L15.27 25.59L5.64 17.27L18.91 16.26L24 4Z"
        fill={color}
      />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="20" fill={color} opacity="0.15" />
      <path
        d="M14 24L20.5 31L34 17"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ color }: { color: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M24 40C24 40 6 29 6 17.5C6 12.25 10.25 8 15.5 8C18.76 8 21.65 9.65 23.99 12.01C26.34 9.65 29.24 8 32.5 8C37.75 8 42 12.25 42 17.5C42 29 24 40 24 40Z"
        fill={color}
      />
    </svg>
  );
}

export default function ResultScreen({ state, onTryAgain, onHome }: Props) {
  const { score } = state;
  const { playComplete } = useContext(SoundContext);
  const playCompleteRef = useRef(playComplete);
  const scoreRef = useRef(score);
  playCompleteRef.current = playComplete;
  scoreRef.current = score;

  useEffect(() => {
    playCompleteRef.current(scoreRef.current);
  }, []);

  const effortMessage = useMemo(() => {
    return EFFORT_CLOSING_MESSAGES[
      Math.floor(Math.random() * EFFORT_CLOSING_MESSAGES.length)
    ];
  }, []);

  const totalRounds = state.totalRounds ?? 5;
  const pct = score / totalRounds;

  const config =
    pct >= 0.8
      ? {
          iconType: "star" as const,
          headline: "Amazing work!",
          accent: "oklch(0.50 0.15 155)",
          bg: "oklch(0.93 0.05 155)",
          border: "oklch(0.78 0.09 155)",
        }
      : pct >= 0.6
        ? {
            iconType: "check" as const,
            headline: "Good effort!",
            accent: "oklch(0.60 0.14 75)",
            bg: "oklch(0.96 0.05 85)",
            border: "oklch(0.84 0.10 80)",
          }
        : {
            iconType: "heart" as const,
            headline: "Keep practicing!",
            accent: "oklch(0.50 0.13 220)",
            bg: "oklch(0.94 0.04 220)",
            border: "oklch(0.80 0.08 220)",
          };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4">
      <div
        className="w-full max-w-sm rounded-xl border p-8 text-center"
        style={{ borderColor: config.border, backgroundColor: "oklch(1 0 0)" }}
      >
        <div className="flex justify-center mb-4">
          {config.iconType === "star" && <StarIcon color={config.accent} />}
          {config.iconType === "check" && <CheckIcon color={config.accent} />}
          {config.iconType === "heart" && <HeartIcon color={config.accent} />}
        </div>

        <h2
          className="text-2xl font-medium mb-2"
          style={{
            fontFamily: "Space Grotesk, system-ui, sans-serif",
            color: "oklch(0.22 0.02 55)",
          }}
        >
          {config.headline}
        </h2>

        <p className="text-base mb-6" style={{ color: "oklch(0.50 0.02 60)" }}>
          You got{" "}
          <span className="font-medium" style={{ color: config.accent }}>
            {score} out of {totalRounds}
          </span>{" "}
          correct.
        </p>

        {/* Effort card — always shown */}
        <div
          data-ocid="result.card"
          className="rounded-lg border px-4 py-3 mb-6 text-left"
          style={{
            backgroundColor: "oklch(0.96 0.02 60)",
            borderColor: "oklch(0.88 0.03 60)",
          }}
        >
          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0">
              <LeafIcon />
            </span>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "oklch(0.42 0.04 55)" }}
            >
              {effortMessage}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            data-ocid="result.try_again_button"
            onClick={onTryAgain}
            className="w-full py-2.5 rounded-lg border font-medium text-sm transition-colors"
            style={{
              borderColor: config.border,
              color: config.accent,
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                config.bg;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            Try again
          </button>

          <button
            type="button"
            data-ocid="result.secondary_button"
            onClick={onHome}
            className="w-full py-2.5 rounded-lg border text-sm transition-colors"
            style={{
              borderColor: "oklch(0.82 0.05 280)",
              color: "oklch(0.45 0.10 280)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.95 0.03 280)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            Try a different module
          </button>

          <button
            type="button"
            data-ocid="result.home_button"
            onClick={onHome}
            className="w-full py-2 rounded-lg border text-xs transition-colors"
            style={{
              borderColor: "oklch(0.88 0.012 70)",
              color: "oklch(0.60 0.02 60)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.95 0.005 70)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
