import type { CatId, Difficulty } from "../App";

interface Props {
  catId: Exclude<CatId, "calm">;
  onSelect: (difficulty: Difficulty) => void;
  onBack: () => void;
  suggestedDifficulty?: Difficulty;
  suggestionReason?: string;
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

const DIFFICULTY_OPTIONS: {
  id: Difficulty;
  label: string;
  description: string;
}[] = [
  {
    id: "beginner",
    label: "Beginner",
    description: "Simple counting, basic addition, small numbers",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "High school warm-up — bigger numbers, challenging patterns",
  },
  {
    id: "medium",
    label: "Medium",
    description: "A bit more challenge — two-digit numbers, mixed operations",
  },
  {
    id: "hard",
    label: "Hard",
    description: "Larger numbers, new question types, trickier patterns",
  },
];

function DifficultyIcon({ id }: { id: Difficulty }) {
  if (id === "beginner") {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 16 16"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    );
  }
  if (id === "intermediate") {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 16 16"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>
    );
  }
  if (id === "medium") {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 16 16"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="8" cy="8" r="3" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="6" fill="currentColor" />
    </svg>
  );
}

export default function DifficultyScreen({
  catId,
  onSelect,
  onBack,
  suggestedDifficulty,
  suggestionReason,
}: Props) {
  const colors = MODULE_COLORS[catId] ?? MODULE_COLORS.number;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 pt-5 pb-3 max-w-3xl mx-auto w-full">
        <button
          type="button"
          data-ocid="difficulty.back_button"
          onClick={onBack}
          className="text-sm px-3 py-1.5 rounded-md border transition-colors min-h-[40px]"
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
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm md:max-w-md">
          <h1
            className="text-2xl md:text-3xl font-medium mb-2 text-center"
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              color: "oklch(0.22 0.02 55)",
            }}
          >
            Choose your level
          </h1>
          <p
            className="text-sm md:text-base text-center mb-1"
            style={{ color: "oklch(0.50 0.02 60)" }}
          >
            You can always change this next time.
          </p>
          <p
            className="text-xs text-center mb-7"
            style={{ color: "oklch(0.42 0.03 60)" }}
          >
            5 questions · about 3 minutes
          </p>

          {suggestedDifficulty && suggestionReason && (
            <div
              className="rounded-xl border px-4 py-3 mb-4 text-sm"
              data-ocid="difficulty.suggestion_panel"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.bg,
                color: colors.accent,
              }}
            >
              {suggestionReason}
            </div>
          )}
          <div className="flex flex-col gap-3">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                data-ocid={`difficulty.${opt.id}_button`}
                onClick={() => onSelect(opt.id)}
                className="w-full rounded-xl border transition-colors text-left min-h-[72px] md:min-h-[80px] px-5 py-4 flex items-center gap-4"
                style={{
                  borderColor:
                    suggestedDifficulty === opt.id
                      ? colors.accent
                      : colors.border,
                  backgroundColor:
                    suggestedDifficulty === opt.id ? colors.bg : "transparent",
                  color: colors.accent,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    colors.bg;
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    colors.accent;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    suggestedDifficulty === opt.id ? colors.bg : "transparent";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    suggestedDifficulty === opt.id
                      ? colors.accent
                      : colors.border;
                }}
              >
                <span className="w-6 flex items-center justify-center flex-shrink-0">
                  <DifficultyIcon id={opt.id} />
                </span>
                <div>
                  <div
                    className="font-semibold text-base md:text-lg"
                    style={{
                      fontFamily: "Fraunces, Georgia, serif",
                      color: "oklch(0.22 0.02 55)",
                    }}
                  >
                    {opt.label}
                  </div>
                  <div
                    className="text-sm mt-0.5"
                    style={{ color: "oklch(0.50 0.02 60)" }}
                  >
                    {opt.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
