import { useEffect, useRef, useState } from "react";

interface Props {
  onBack: () => void;
}

const PHASES = [
  { label: "Breathe in...", duration: 4000, size: 138 },
  { label: "Hold...", duration: 4000, size: 138 },
  { label: "Breathe out...", duration: 4000, size: 70 },
  { label: "Rest...", duration: 2000, size: 70 },
];

const AFFIRMATIONS = [
  "I can understand numbers at my own pace.",
  "Making mistakes is part of learning.",
  "I am getting better every time I practice.",
  "My brain is working hard and that matters.",
  "Every attempt makes me stronger.",
  "I don't have to be fast to be smart.",
  "It's okay to take my time.",
  "I showed up today and that counts.",
];

const TOTAL_CYCLES = 4;

export default function CalmScreen({ onBack }: Props) {
  const [phase, setPhase] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [done, setDone] = useState(false);
  const [affirmation, setAffirmation] = useState(
    () => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)],
  );
  const [circleSize, setCircleSize] = useState(70);
  const affirmIdxRef = useRef(Math.floor(Math.random() * AFFIRMATIONS.length));

  useEffect(() => {
    if (done) return;

    const currentPhase = PHASES[phase];
    setCircleSize(currentPhase.size);

    if (phase === 2) {
      const nextIdx = (affirmIdxRef.current + 1) % AFFIRMATIONS.length;
      affirmIdxRef.current = nextIdx;
      setAffirmation(AFFIRMATIONS[nextIdx]);
    }

    const timer = setTimeout(() => {
      const nextPhase = (phase + 1) % 4;
      const nextCycle = nextPhase === 0 ? cycle + 1 : cycle;

      if (nextPhase === 0 && cycle + 1 >= TOTAL_CYCLES) {
        setDone(true);
        return;
      }

      setPhase(nextPhase);
      setCycle(nextCycle);
    }, currentPhase.duration);

    return () => clearTimeout(timer);
  }, [phase, cycle, done]);

  const roseAccent = "oklch(0.58 0.18 0)";
  const roseBg = "oklch(0.96 0.04 5)";
  const roseBorder = "oklch(0.83 0.09 5)";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 pt-5 pb-3 max-w-2xl mx-auto w-full">
        <button
          type="button"
          data-ocid="calm.back_button"
          onClick={onBack}
          className="text-sm px-3 py-1.5 rounded-md border transition-colors"
          style={{
            borderColor: roseBorder,
            color: roseAccent,
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              roseBg;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent";
          }}
        >
          ← Back
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8 gap-8">
        {done ? (
          <div className="text-center">
            <div
              className="text-5xl mb-4"
              style={{
                color: roseAccent,
                fontFamily: "Fraunces, Georgia, serif",
              }}
            >
              Done!
            </div>
            <p className="text-base" style={{ color: "oklch(0.50 0.02 60)" }}>
              You completed the breathing exercise.
            </p>
            <button
              type="button"
              onClick={onBack}
              className="mt-6 px-6 py-2.5 rounded-lg border text-sm transition-colors"
              style={{
                borderColor: roseBorder,
                color: roseAccent,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  roseBg;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              Back to home
            </button>
          </div>
        ) : (
          <>
            <div
              className="breathe-circle rounded-full"
              style={{
                width: circleSize,
                height: circleSize,
                backgroundColor: "oklch(0.90 0.06 5)",
                borderColor: roseBorder,
                borderWidth: "1px",
                borderStyle: "solid",
                transition: "width 1s ease-in-out, height 1s ease-in-out",
              }}
            />

            <div className="text-center">
              <p
                className="text-2xl font-medium mb-1"
                aria-live="polite"
                aria-atomic="true"
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  color: roseAccent,
                }}
              >
                {PHASES[phase].label}
              </p>
              <p className="text-xs" style={{ color: "oklch(0.65 0.01 60)" }}>
                Cycle {cycle + 1} of {TOTAL_CYCLES}
              </p>
            </div>

            <p
              className="text-sm text-center max-w-xs leading-relaxed"
              style={{ color: "oklch(0.50 0.02 60)" }}
            >
              {affirmation}
            </p>
          </>
        )}
      </main>
    </div>
  );
}
