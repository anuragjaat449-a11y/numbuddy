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
    accent: "oklch(0.72 0.18 280)",
    bg: "oklch(0.17 0.015 260)",
    bgHover: "oklch(0.20 0.02 260)",
    border: "oklch(0.28 0.015 260)",
    glow: "oklch(0.72 0.18 280 / 0.15)",
  },
  {
    id: "arith",
    name: "Arithmetic",
    description:
      "Solve addition and subtraction with step-by-step visual guides.",
    accent: "oklch(0.72 0.18 190)",
    bg: "oklch(0.17 0.015 260)",
    bgHover: "oklch(0.20 0.02 260)",
    border: "oklch(0.28 0.015 260)",
    glow: "oklch(0.72 0.18 190 / 0.15)",
  },
  {
    id: "sequence",
    name: "Counting & Sequences",
    description:
      "Fill in missing numbers, spot patterns, and understand tens and ones.",
    accent: "oklch(0.72 0.16 70)",
    bg: "oklch(0.17 0.015 260)",
    bgHover: "oklch(0.20 0.02 260)",
    border: "oklch(0.28 0.015 260)",
    glow: "oklch(0.72 0.16 70 / 0.15)",
  },
  {
    id: "money",
    name: "Money & Real Life",
    description:
      "Count coins and bills, read receipts, and solve everyday money problems.",
    accent: "oklch(0.72 0.16 75)",
    bg: "oklch(0.17 0.015 260)",
    bgHover: "oklch(0.20 0.02 260)",
    border: "oklch(0.28 0.015 260)",
    glow: "oklch(0.72 0.16 75 / 0.15)",
  },
  {
    id: "time",
    name: "Time & Scheduling",
    description:
      "Read clocks, figure out dates, and calculate how much time has passed.",
    accent: "oklch(0.68 0.16 220)",
    bg: "oklch(0.17 0.015 260)",
    bgHover: "oklch(0.20 0.02 260)",
    border: "oklch(0.28 0.015 260)",
    glow: "oklch(0.68 0.16 220 / 0.15)",
  },
  {
    id: "numberline",
    name: "Number Line",
    description:
      "Place numbers on a number line — one of the most effective exercises for number sense.",
    accent: "oklch(0.70 0.18 330)",
    bg: "oklch(0.17 0.015 260)",
    bgHover: "oklch(0.20 0.02 260)",
    border: "oklch(0.28 0.015 260)",
    glow: "oklch(0.70 0.18 330 / 0.15)",
  },
  {
    id: "estimation",
    name: "Estimation",
    description:
      "About how many? Practice judging quantities at a glance — a key everyday skill.",
    accent: "oklch(0.68 0.16 195)",
    bg: "oklch(0.17 0.015 260)",
    bgHover: "oklch(0.20 0.02 260)",
    border: "oklch(0.28 0.015 260)",
    glow: "oklch(0.68 0.16 195 / 0.15)",
  },
  {
    id: "stepseq",
    name: "Step-by-Step Sequencing",
    description:
      "Everyday procedures broken into steps. Practice following sequences — one step at a time.",
    accent: "oklch(0.68 0.16 175)",
    bg: "oklch(0.17 0.015 260)",
    bgHover: "oklch(0.20 0.02 260)",
    border: "oklch(0.28 0.015 260)",
    glow: "oklch(0.68 0.16 175 / 0.15)",
  },
  {
    id: "fractions",
    name: "Fractions",
    description:
      "Identify shaded fractions, compare them, and explore equivalents using visual fraction bars.",
    accent: "oklch(0.72 0.18 130)",
    bg: "oklch(0.17 0.015 260)",
    bgHover: "oklch(0.20 0.02 260)",
    border: "oklch(0.28 0.015 260)",
    glow: "oklch(0.72 0.18 130 / 0.15)",
  },
  {
    id: "measurement",
    name: "Measurement",
    description:
      "Read rulers, compare lengths and weights, and measure liquid in cups.",
    accent: "oklch(0.68 0.16 210)",
    bg: "oklch(0.17 0.015 260)",
    bgHover: "oklch(0.20 0.02 260)",
    border: "oklch(0.28 0.015 260)",
    glow: "oklch(0.68 0.16 210 / 0.15)",
  },
];

function StudymoreMark() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="10" fill="oklch(0.72 0.18 190 / 0.15)" />
      <text
        x="18"
        y="26"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fontFamily="Space Grotesk, system-ui, sans-serif"
        fill="oklch(0.72 0.18 190)"
      >
        Σ
      </text>
    </svg>
  );
}

const SUGGEST_DISMISS_KEY = "numbuddy_suggest_dismissed";

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
          backgroundColor: "oklch(0.72 0.16 70 / 0.12)",
          color: "oklch(0.72 0.16 70)",
          border: "1px solid oklch(0.72 0.16 70 / 0.25)",
        }}
      >
        <p className="flex-1" style={{ color: "oklch(0.75 0.01 260)" }}>
          Based on your practice,{" "}
          <strong style={{ color: "oklch(0.72 0.16 70)" }}>{moduleName}</strong>{" "}
          could use some attention.
        </p>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            data-ocid="home.primary_button"
            onClick={onGo}
            className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors min-h-[32px]"
            style={{
              backgroundColor: "oklch(0.72 0.16 70 / 0.2)",
              color: "oklch(0.72 0.16 70)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.72 0.16 70 / 0.32)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.72 0.16 70 / 0.2)";
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
            style={{ color: "oklch(0.50 0.01 260)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.72 0.16 70 / 0.15)";
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
      style={{ backgroundColor: "oklch(0.11 0.01 260)" }}
    >
      {/* Header */}
      <header
        style={{
          paddingTop: "2.5rem",
          paddingBottom: "1.5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          textAlign: "center",
          borderBottom: "1px solid oklch(0.20 0.015 260)",
          backgroundColor: "oklch(0.14 0.015 260)",
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
          <StudymoreMark />
          <h1
            style={{
              fontFamily: "Space Grotesk, system-ui, sans-serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "oklch(0.93 0.01 260)",
              margin: 0,
            }}
          >
            Studymore
          </h1>
        </div>
        <p
          style={{
            fontSize: "0.95rem",
            color: "oklch(0.50 0.01 260)",
            marginBottom: "1.5rem",
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
              backgroundColor: "oklch(0.72 0.18 190)",
              color: "oklch(0.12 0.01 190)",
              border: "none",
              transition: "all 0.2s ease",
              minHeight: "40px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.65 0.20 190)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 20px oklch(0.72 0.18 190 / 0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.72 0.18 190)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            Take the assessment
          </button>
          <p
            style={{
              fontSize: "0.72rem",
              marginTop: "0.35rem",
              color: "oklch(0.45 0.08 190)",
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
              color: "oklch(0.68 0.16 220)",
              bg: "oklch(0.68 0.16 220 / 0.12)",
              borderColor: "oklch(0.68 0.16 220 / 0.3)",
            },
            {
              label: "Parent & Teacher View",
              ocid: "home.dashboard_button",
              onClick: onDashboard,
              color: "oklch(0.68 0.16 175)",
              bg: "oklch(0.68 0.16 175 / 0.12)",
              borderColor: "oklch(0.68 0.16 175 / 0.3)",
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
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.8";
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
              color: muted ? "oklch(0.45 0.01 260)" : "oklch(0.72 0.16 70)",
              backgroundColor: muted
                ? "oklch(0.22 0.01 260)"
                : "oklch(0.72 0.16 70 / 0.12)",
              border: `1px solid ${muted ? "oklch(0.28 0.01 260)" : "oklch(0.72 0.16 70 / 0.3)"}`,
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
                color: "oklch(0.65 0.16 280)",
                backgroundColor: "oklch(0.65 0.16 280 / 0.12)",
                border: "1px solid oklch(0.65 0.16 280 / 0.3)",
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
                color: "oklch(0.93 0.01 260)",
                backgroundColor: "oklch(0.65 0.16 280 / 0.8)",
                border: "1px solid oklch(0.65 0.16 280 / 0.5)",
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
            color: "oklch(0.40 0.01 260)",
            marginBottom: "0.875rem",
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
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = mod.bgHover;
                el.style.borderColor = mod.accent.replace(")", " / 0.5)");
                el.style.boxShadow = `0 0 0 1px ${mod.accent.replace(")", " / 0.2)")}, 0 4px 16px ${mod.glow}`;
                el.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = mod.bg;
                el.style.borderColor = mod.border;
                el.style.boxShadow = "none";
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
                  backgroundColor: mod.accent.replace(")", " / 0.12)"),
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
                  fontFamily: "Space Grotesk, system-ui, sans-serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "oklch(0.90 0.01 260)",
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
                  color: "oklch(0.50 0.01 260)",
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
            border: "1px dashed oklch(0.70 0.15 0 / 0.4)",
            backgroundColor: "oklch(0.70 0.15 0 / 0.06)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "oklch(0.70 0.15 0 / 0.12)";
            el.style.borderColor = "oklch(0.70 0.15 0 / 0.6)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "oklch(0.70 0.15 0 / 0.06)";
            el.style.borderColor = "oklch(0.70 0.15 0 / 0.4)";
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "oklch(0.70 0.15 0 / 0.15)",
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
                color: "oklch(0.70 0.15 0)",
                marginBottom: "0.25rem",
              }}
            >
              Breathing exercise
            </div>
            <h2
              style={{
                fontFamily: "Space Grotesk, system-ui, sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                color: "oklch(0.90 0.01 260)",
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
                color: "oklch(0.50 0.01 260)",
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
