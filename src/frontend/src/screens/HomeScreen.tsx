import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useContext, useEffect, useState } from "react";
import type { CatId } from "../App";
import { SoundContext } from "../context/SoundContext";
import { MODULE_MAP } from "../utils/modules";
import { getAllProgressData, getSuggestedModule } from "../utils/progress";

interface Props {
  onStart: (catId: CatId) => void;
  onProgress: () => void;
  onAssessment: () => void;
  onDashboard: () => void;
}

const MODULES: {
  id: Exclude<CatId, "calm">;
  name: string;
  description: string;
  accent: string;
  bg: string;
  bgHover: string;
  border: string;
  glow: string;
}[] = [
  {
    id: "number",
    name: "Number Sense",
    description:
      "A dot pattern appears briefly. How many did you see? Compare numbers and group them.",
    accent: "oklch(0.38 0.10 280)",
    bg: "oklch(1 0 0)",
    bgHover: "oklch(0.97 0.006 280)",
    border: "oklch(0.88 0.012 70)",
    glow: "oklch(0.38 0.10 280 / 0.12)",
  },
  {
    id: "arith",
    name: "Arithmetic",
    description:
      "Solve addition and subtraction with step-by-step visual guides.",
    accent: "oklch(0.38 0.10 200)",
    bg: "oklch(1 0 0)",
    bgHover: "oklch(0.97 0.008 200)",
    border: "oklch(0.88 0.012 70)",
    glow: "oklch(0.38 0.10 200 / 0.12)",
  },
  {
    id: "sequence",
    name: "Counting & Sequences",
    description:
      "Fill in missing numbers, spot patterns, and understand tens and ones.",
    accent: "oklch(0.42 0.10 55)",
    bg: "oklch(1 0 0)",
    bgHover: "oklch(0.97 0.008 55)",
    border: "oklch(0.88 0.012 70)",
    glow: "oklch(0.42 0.10 55 / 0.12)",
  },
  {
    id: "money",
    name: "Money & Real Life",
    description:
      "Count coins and bills, read receipts, and solve everyday money problems.",
    accent: "oklch(0.45 0.10 60)",
    bg: "oklch(1 0 0)",
    bgHover: "oklch(0.97 0.008 60)",
    border: "oklch(0.88 0.012 70)",
    glow: "oklch(0.45 0.10 60 / 0.12)",
  },
  {
    id: "time",
    name: "Time & Scheduling",
    description:
      "Read clocks, figure out dates, and calculate how much time has passed.",
    accent: "oklch(0.40 0.10 220)",
    bg: "oklch(1 0 0)",
    bgHover: "oklch(0.97 0.008 220)",
    border: "oklch(0.88 0.012 70)",
    glow: "oklch(0.40 0.10 220 / 0.12)",
  },
  {
    id: "numberline",
    name: "Number Line",
    description:
      "Place numbers on a number line — one of the most effective exercises for number sense.",
    accent: "oklch(0.40 0.10 300)",
    bg: "oklch(1 0 0)",
    bgHover: "oklch(0.97 0.008 300)",
    border: "oklch(0.88 0.012 70)",
    glow: "oklch(0.40 0.10 300 / 0.12)",
  },
  {
    id: "estimation",
    name: "Estimation",
    description:
      "About how many? Practice judging quantities at a glance — a key everyday skill.",
    accent: "oklch(0.38 0.10 195)",
    bg: "oklch(1 0 0)",
    bgHover: "oklch(0.97 0.008 195)",
    border: "oklch(0.88 0.012 70)",
    glow: "oklch(0.38 0.10 195 / 0.12)",
  },
  {
    id: "stepseq",
    name: "Step-by-Step Sequencing",
    description:
      "Everyday procedures broken into steps. Practice following sequences — one step at a time.",
    accent: "oklch(0.38 0.10 170)",
    bg: "oklch(1 0 0)",
    bgHover: "oklch(0.97 0.008 170)",
    border: "oklch(0.88 0.012 70)",
    glow: "oklch(0.38 0.10 170 / 0.12)",
  },
  {
    id: "fractions",
    name: "Fractions",
    description:
      "Identify shaded fractions, compare them, and explore equivalents using visual fraction bars.",
    accent: "oklch(0.40 0.10 140)",
    bg: "oklch(1 0 0)",
    bgHover: "oklch(0.97 0.008 140)",
    border: "oklch(0.88 0.012 70)",
    glow: "oklch(0.40 0.10 140 / 0.12)",
  },
  {
    id: "measurement",
    name: "Measurement",
    description:
      "Read rulers, compare lengths and weights, and measure liquid in cups.",
    accent: "oklch(0.40 0.10 210)",
    bg: "oklch(1 0 0)",
    bgHover: "oklch(0.97 0.008 210)",
    border: "oklch(0.88 0.012 70)",
    glow: "oklch(0.40 0.10 210 / 0.12)",
  },
];

function BrainWarmupMark() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="10" fill="oklch(0.72 0.15 50 / 0.15)" />
      {/* Brain outline */}
      <path
        d="M13 10c-1.8 0-3.5 1-4.2 2.6-.6 1.4-.3 2.9.5 4-.7.8-1.1 1.9-1 3.1.2 2.2 2 3.8 4 4.1.2 1.5 1.4 2.7 2.9 2.8.3 0 .6 0 .8-.1V27h4v-.5c.3.1.5.1.8.1 1.5-.1 2.7-1.3 2.9-2.8 2-.3 3.8-1.9 4-4.1.1-1.2-.3-2.3-1-3.1.8-1.1 1.1-2.6.5-4-.7-1.6-2.4-2.6-4.2-2.6-.7 0-1.4.2-2 .5-.9-.6-1.9-.9-3-.9s-2.1.3-3 .9c-.6-.3-1.3-.5-2-.5z"
        fill="oklch(0.72 0.15 50)"
        opacity="0.9"
      />
      {/* Highlight spark */}
      <circle cx="25" cy="9" r="1.5" fill="oklch(0.60 0.18 60)" opacity="0.8" />
      <path
        d="M24 8l1 1M25 7v1"
        stroke="oklch(0.60 0.18 60)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

const SUGGEST_DISMISS_KEY = "brainwarmup_suggest_dismissed";

function SuggestionBanner({
  catId,
  onGo,
}: { catId: string; onGo: () => void }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(SUGGEST_DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  if (dismissed) return null;
  const moduleName = MODULE_MAP[catId]?.label ?? catId;

  function handleDismiss() {
    try {
      sessionStorage.setItem(SUGGEST_DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }

  return (
    <section
      data-ocid="home.panel"
      aria-label={`Suggestion: practise ${moduleName}`}
      className="max-w-2xl md:max-w-3xl mx-auto w-full px-4 mb-2"
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm"
        style={{
          backgroundColor: "oklch(0.45 0.10 60 / 0.08)",
          color: "oklch(0.38 0.08 55)",
          border: "1px solid oklch(0.45 0.10 60 / 0.22)",
        }}
      >
        <p className="flex-1" style={{ color: "oklch(0.35 0.02 55)" }}>
          Based on your practice,{" "}
          <strong style={{ color: "oklch(0.38 0.08 55)" }}>{moduleName}</strong>{" "}
          could use some attention.
        </p>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            data-ocid="home.primary_button"
            onClick={onGo}
            className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors min-h-[32px]"
            style={{
              backgroundColor: "oklch(0.45 0.10 60 / 0.15)",
              color: "oklch(0.38 0.08 55)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.45 0.10 60 / 0.28)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.45 0.10 60 / 0.15)";
            }}
          >
            Practise →
          </button>
          <button
            type="button"
            data-ocid="home.close_button"
            onClick={handleDismiss}
            aria-label="Dismiss suggestion"
            className="w-7 h-7 flex items-center justify-center rounded-full transition-colors ml-0.5"
            style={{ color: "oklch(0.55 0.015 60)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.45 0.10 60 / 0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 2l8 8M10 2l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default function HomeScreen({
  onStart,
  onProgress,
  onAssessment,
  onDashboard,
}: Props) {
  const { muted, toggleMute } = useContext(SoundContext);
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principal = isAuthenticated ? identity.getPrincipal().toString() : null;
  const shortPrincipal = principal ? `${principal.slice(0, 5)}...` : null;

  const [suggestedCatId, setSuggestedCatId] = useState<string | null>(null);
  useEffect(() => {
    const data = getAllProgressData();
    const totalSessions = Object.values(data).reduce(
      (sum, s) => sum + s.length,
      0,
    );
    if (totalSessions >= 3) setSuggestedCatId(getSuggestedModule());
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "oklch(0.98 0.006 75)" }}
    >
      {/* Header */}
      <header
        style={{
          paddingTop: "2.5rem",
          paddingBottom: "1.5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          textAlign: "center",
          borderBottom: "1px solid oklch(0.88 0.012 70)",
          backgroundColor: "oklch(1 0 0)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "0.5rem",
          }}
        >
          <BrainWarmupMark />
          <h1
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "oklch(0.22 0.02 55)",
              margin: 0,
            }}
          >
            Brain Warmup
          </h1>
        </div>
        <p
          style={{
            fontSize: "0.95rem",
            color: "oklch(0.55 0.015 60)",
            marginBottom: "1.5rem",
            fontFamily: "Figtree, system-ui, sans-serif",
          }}
        >
          Practice at your own pace
        </p>

        {/* Assessment CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <button
            type="button"
            data-ocid="home.assessment_button"
            onClick={onAssessment}
            style={{
              fontSize: "0.875rem",
              padding: "0.5rem 1.5rem",
              borderRadius: "999px",
              fontWeight: 600,
              cursor: "pointer",
              background:
                "linear-gradient(135deg, oklch(0.65 0.15 50) 0%, oklch(0.52 0.14 190) 100%)",
              color: "oklch(0.99 0.003 75)",
              border: "none",
              transition: "all 0.2s ease",
              minHeight: "40px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 20px oklch(0.65 0.15 50 / 0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            Take the assessment
          </button>
          <p
            style={{
              fontSize: "0.72rem",
              marginTop: "0.35rem",
              color: "oklch(0.55 0.015 60)",
            }}
          >
            Recommended first step
          </p>
        </div>

        {/* Utility row */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            {
              label: "Your progress",
              ocid: "home.progress_button",
              onClick: onProgress,
              color: "oklch(0.40 0.10 220)",
              bg: "oklch(0.40 0.10 220 / 0.08)",
              borderColor: "oklch(0.40 0.10 220 / 0.25)",
            },
            {
              label: "Parent & Teacher View",
              ocid: "home.dashboard_button",
              onClick: onDashboard,
              color: "oklch(0.38 0.10 170)",
              bg: "oklch(0.38 0.10 170 / 0.08)",
              borderColor: "oklch(0.38 0.10 170 / 0.25)",
            },
          ].map(({ label, ocid, onClick, color, bg, borderColor }) => (
            <button
              key={ocid}
              type="button"
              data-ocid={ocid}
              onClick={onClick}
              style={{
                fontSize: "0.75rem",
                padding: "0.35rem 0.875rem",
                borderRadius: "999px",
                cursor: "pointer",
                color,
                backgroundColor: bg,
                border: `1px solid ${borderColor}`,
                transition: "all 0.15s ease",
                minHeight: "32px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.75";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              }}
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            data-ocid="home.sound_toggle"
            onClick={toggleMute}
            style={{
              fontSize: "0.75rem",
              padding: "0.35rem 0.875rem",
              borderRadius: "999px",
              cursor: "pointer",
              color: muted ? "oklch(0.55 0.015 60)" : "oklch(0.42 0.10 55)",
              backgroundColor: muted
                ? "oklch(0.92 0.006 75)"
                : "oklch(0.42 0.10 55 / 0.10)",
              border: `1px solid ${muted ? "oklch(0.84 0.012 70)" : "oklch(0.42 0.10 55 / 0.28)"}`,
              transition: "all 0.15s ease",
              minHeight: "32px",
            }}
          >
            {muted ? "Sound off" : "Sound on"}
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              data-ocid="home.signout_button"
              onClick={clear}
              style={{
                fontSize: "0.75rem",
                padding: "0.35rem 0.875rem",
                borderRadius: "999px",
                cursor: "pointer",
                color: "oklch(0.40 0.10 280)",
                backgroundColor: "oklch(0.40 0.10 280 / 0.08)",
                border: "1px solid oklch(0.40 0.10 280 / 0.25)",
                transition: "all 0.15s ease",
                minHeight: "32px",
              }}
            >
              {shortPrincipal} · Sign out
            </button>
          ) : (
            <button
              type="button"
              data-ocid="home.signin_button"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              style={{
                fontSize: "0.75rem",
                padding: "0.35rem 0.875rem",
                borderRadius: "999px",
                cursor: "pointer",
                color: "oklch(0.99 0.003 75)",
                background:
                  "linear-gradient(135deg, oklch(0.65 0.15 50) 0%, oklch(0.52 0.14 190) 100%)",
                border: "none",
                transition: "all 0.15s ease",
                minHeight: "32px",
                opacity: isLoggingIn || isInitializing ? 0.5 : 1,
              }}
            >
              {isLoggingIn ? "Signing in…" : "Sign in"}
            </button>
          )}
        </div>
      </header>

      {/* Suggestion banner */}
      {suggestedCatId && (
        <div
          style={{
            paddingTop: "1rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          }}
        >
          <SuggestionBanner
            catId={suggestedCatId}
            onGo={() => onStart(suggestedCatId as CatId)}
          />
        </div>
      )}

      {/* Module grid */}
      <main
        id="main-content"
        style={{
          flex: 1,
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
          padding: "1.5rem 1rem 2rem",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "oklch(0.65 0.012 60)",
            marginBottom: "0.875rem",
            fontFamily: "Figtree, system-ui, sans-serif",
          }}
        >
          Choose a module
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          {MODULES.map((mod) => (
            <button
              type="button"
              key={mod.id}
              data-ocid={`home.${mod.id}_button`}
              onClick={() => onStart(mod.id)}
              aria-label={`${mod.name}: ${mod.description}`}
              style={{
                textAlign: "left",
                borderRadius: "0.875rem",
                padding: "1.25rem 1.5rem",
                border: `1px solid ${mod.border}`,
                backgroundColor: mod.bg,
                cursor: "pointer",
                transition: "all 0.2s ease",
                minHeight: "100px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 1px 3px oklch(0.22 0.02 55 / 0.06)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = mod.bgHover;
                el.style.borderColor = mod.accent.replace(")", " / 0.45)");
                el.style.boxShadow = `0 0 0 1px ${mod.accent.replace(")", " / 0.18)")}, 0 4px 16px ${mod.glow}`;
                el.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = mod.bg;
                el.style.borderColor = mod.border;
                el.style.boxShadow = "0 1px 3px oklch(0.22 0.02 55 / 0.06)";
                el.style.transform = "none";
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: mod.accent,
                  backgroundColor: mod.accent.replace(")", " / 0.10)"),
                  padding: "0.15rem 0.55rem",
                  borderRadius: "999px",
                  display: "inline-block",
                  marginBottom: "0.65rem",
                }}
              >
                5 questions
              </div>
              <h2
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "oklch(0.22 0.02 55)",
                  marginBottom: "0.375rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {mod.name}
              </h2>
              <p
                style={{
                  fontSize: "0.82rem",
                  lineHeight: 1.55,
                  color: "oklch(0.55 0.015 60)",
                  fontFamily: "Figtree, system-ui, sans-serif",
                }}
              >
                {mod.description}
              </p>
            </button>
          ))}
        </div>

        {/* Breathe & Grow */}
        <button
          type="button"
          data-ocid="home.calm_button"
          onClick={() => onStart("calm")}
          style={{
            width: "100%",
            textAlign: "left",
            borderRadius: "0.875rem",
            padding: "1.25rem 1.5rem",
            border: "1px dashed oklch(0.45 0.10 60 / 0.35)",
            backgroundColor: "oklch(0.45 0.10 60 / 0.05)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "oklch(0.45 0.10 60 / 0.10)";
            el.style.borderColor = "oklch(0.45 0.10 60 / 0.55)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "oklch(0.45 0.10 60 / 0.05)";
            el.style.borderColor = "oklch(0.45 0.10 60 / 0.35)";
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "oklch(0.45 0.10 60 / 0.12)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
            }}
          >
            🌬️
          </div>
          <div>
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "oklch(0.45 0.10 60)",
                marginBottom: "0.25rem",
                fontFamily: "Figtree, system-ui, sans-serif",
              }}
            >
              Breathing exercise
            </div>
            <h2
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "1rem",
                fontWeight: 600,
                color: "oklch(0.22 0.02 55)",
                marginBottom: "0.25rem",
                letterSpacing: "-0.01em",
              }}
            >
              Breathe &amp; Grow
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                lineHeight: 1.55,
                color: "oklch(0.55 0.015 60)",
                fontFamily: "Figtree, system-ui, sans-serif",
              }}
            >
              A gentle box-breathing exercise with affirmations for math
              anxiety. No quiz, no score.
            </p>
          </div>
        </button>
      </main>
    </div>
  );
}
