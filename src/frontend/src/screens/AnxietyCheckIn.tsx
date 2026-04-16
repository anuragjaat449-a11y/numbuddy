import { useEffect, useRef, useState } from "react";
import type { CatId } from "../App";

interface Props {
  catId: Exclude<CatId, "calm">;
  onConfirm: () => void;
  onBack: () => void;
  onCalm: () => void;
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

export default function AnxietyCheckIn({
  catId,
  onConfirm,
  onBack,
  onCalm,
}: Props) {
  const [anxiousExpanded, setAnxiousExpanded] = useState(false);
  const [showNervousNote, setShowNervousNote] = useState(false);
  const colors = MODULE_COLORS[catId] ?? MODULE_COLORS.number;
  const nervousClickedRef = useRef(false);
  const nervousTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset anxious expanded state on mount
  useEffect(() => {
    setAnxiousExpanded(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      nervousClickedRef.current = false;
      if (nervousTimerRef.current) clearTimeout(nervousTimerRef.current);
    };
  }, []);

  function handleNervousClick() {
    if (nervousClickedRef.current) return;
    nervousClickedRef.current = true;
    setShowNervousNote(true);
    nervousTimerRef.current = setTimeout(onConfirm, 1800);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 pt-5 pb-3 max-w-3xl mx-auto w-full">
        <button
          type="button"
          data-ocid="checkin.back_button"
          onClick={() => {
            if (nervousTimerRef.current) clearTimeout(nervousTimerRef.current);
            onBack();
          }}
          className="text-sm px-3 py-1.5 rounded-md border transition-colors"
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
              fontFamily: "Space Grotesk, system-ui, sans-serif",
              color: "oklch(0.22 0.02 55)",
            }}
          >
            Before we begin...
          </h1>
          <p
            className="text-sm md:text-base text-center mb-1"
            style={{ color: "oklch(0.50 0.02 60)" }}
          >
            How are you feeling about math right now?
          </p>
          <p
            className="text-xs text-center mb-8"
            style={{ color: "oklch(0.42 0.03 60)" }}
          >
            5 questions · about 3 minutes
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              data-ocid="checkin.calm_button"
              onClick={onConfirm}
              className="w-full rounded-xl border font-medium text-base transition-colors text-center min-h-[52px] md:min-h-[60px] px-5 py-3"
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
              Calm
            </button>

            <div>
              <button
                type="button"
                data-ocid="checkin.nervous_button"
                onClick={handleNervousClick}
                className="w-full rounded-xl border font-medium text-base transition-colors text-center min-h-[52px] md:min-h-[60px] px-5 py-3"
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
                A bit nervous
              </button>
              {showNervousNote && (
                <p
                  className="text-sm text-center mt-2 px-2"
                  style={{ color: "oklch(0.50 0.06 160)" }}
                >
                  That's okay — you've got this. Take a breath and go at your
                  own pace.
                </p>
              )}
            </div>

            <button
              type="button"
              data-ocid="checkin.anxious_button"
              onClick={() => setAnxiousExpanded(true)}
              className="w-full rounded-xl border font-medium text-base transition-colors text-center min-h-[52px] md:min-h-[60px] px-5 py-3"
              style={{
                borderColor: anxiousExpanded
                  ? "oklch(0.52 0.20 25)"
                  : colors.border,
                color: anxiousExpanded ? "oklch(0.42 0.20 25)" : colors.accent,
                backgroundColor: anxiousExpanded
                  ? "oklch(0.94 0.06 25)"
                  : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!anxiousExpanded)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    colors.bg;
              }}
              onMouseLeave={(e) => {
                if (!anxiousExpanded)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "transparent";
              }}
            >
              Anxious
            </button>

            {anxiousExpanded && (
              <div
                className="rounded-xl border p-4 md:p-5"
                style={{
                  borderColor: "oklch(0.83 0.09 5)",
                  backgroundColor: "oklch(0.97 0.03 5)",
                }}
              >
                <p
                  className="text-sm md:text-base leading-relaxed mb-4"
                  style={{ color: "oklch(0.38 0.02 55)" }}
                >
                  That's completely okay. Breathe &amp; Grow can help you feel
                  more settled before practicing. Would you like to try it
                  first?
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    data-ocid="checkin.breathe_button"
                    onClick={onCalm}
                    className="w-full rounded-lg border font-medium text-sm min-h-[52px] transition-colors"
                    style={{
                      borderColor: "oklch(0.83 0.09 5)",
                      color: "oklch(0.58 0.18 0)",
                      backgroundColor: "oklch(0.92 0.06 5)",
                    }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "oklch(0.88 0.08 5)";
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "oklch(0.92 0.06 5)";
                    }}
                  >
                    Try Breathe &amp; Grow
                  </button>
                  <button
                    type="button"
                    data-ocid="checkin.continue_button"
                    onClick={onConfirm}
                    className="w-full rounded-lg border text-sm min-h-[52px] transition-colors"
                    style={{
                      borderColor: colors.border,
                      color: colors.accent,
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = colors.bg;
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "transparent";
                    }}
                  >
                    Continue anyway
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
