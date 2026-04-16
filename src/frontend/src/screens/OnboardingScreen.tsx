interface Props {
  onDone: () => void;
  onBack: () => void;
}

const MODULE_DESCRIPTIONS: {
  name: string;
  description: string;
  accent: string;
}[] = [
  {
    name: "Number Sense",
    description: "Recognize and compare quantities at a glance.",
    accent: "oklch(0.45 0.12 280)",
  },
  {
    name: "Arithmetic",
    description: "Step-by-step addition and subtraction with visual support.",
    accent: "oklch(0.45 0.12 190)",
  },
  {
    name: "Money & Real Life",
    description: "Count coins, read receipts, and make change.",
    accent: "oklch(0.50 0.12 70)",
  },
  {
    name: "Time & Scheduling",
    description: "Read clocks, navigate calendars, and track elapsed time.",
    accent: "oklch(0.45 0.12 220)",
  },
  {
    name: "Counting & Sequences",
    description: "Fill in patterns and explore place value.",
    accent: "oklch(0.50 0.12 55)",
  },
  {
    name: "Number Line",
    description: "Place numbers in space — a core skill for number sense.",
    accent: "oklch(0.45 0.12 330)",
  },
  {
    name: "Estimation",
    description: "Judge quantities at a glance without counting every one.",
    accent: "oklch(0.45 0.12 195)",
  },
  {
    name: "Step-by-Step Sequencing",
    description: "Break multi-step problems into clear, ordered actions.",
    accent: "oklch(0.45 0.12 175)",
  },
  {
    name: "Fractions",
    description:
      "Understand halves, quarters, and eighths with visual fraction bars.",
    accent: "oklch(0.45 0.12 130)",
  },
  {
    name: "Measurement",
    description:
      "Read rulers, scales, and measuring cups in everyday contexts.",
    accent: "oklch(0.45 0.12 210)",
  },
  {
    name: "Breathe & Grow",
    description: "A short breathing exercise for when math feels overwhelming.",
    accent: "oklch(0.55 0.15 15)",
  },
];

function BrainWarmupMark() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="10" fill="oklch(0.72 0.15 50 / 0.15)" />
      <path
        d="M13 10c-1.8 0-3.5 1-4.2 2.6-.6 1.4-.3 2.9.5 4-.7.8-1.1 1.9-1 3.1.2 2.2 2 3.8 4 4.1.2 1.5 1.4 2.7 2.9 2.8.3 0 .6 0 .8-.1V27h4v-.5c.3.1.5.1.8.1 1.5-.1 2.7-1.3 2.9-2.8 2-.3 3.8-1.9 4-4.1.1-1.2-.3-2.3-1-3.1.8-1.1 1.1-2.6.5-4-.7-1.6-2.4-2.6-4.2-2.6-.7 0-1.4.2-2 .5-.9-.6-1.9-.9-3-.9s-2.1.3-3 .9c-.6-.3-1.3-.5-2-.5z"
        fill="oklch(0.72 0.15 50)"
        opacity="0.9"
      />
      <circle cx="25" cy="9" r="1.5" fill="oklch(0.60 0.18 60)" opacity="0.8" />
    </svg>
  );
}

export default function OnboardingScreen({ onDone, onBack }: Props) {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "2.5rem 1.25rem",
        backgroundColor: "oklch(0.98 0.006 75)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "520px" }}>
        {/* Back button */}
        <div style={{ marginBottom: "1.5rem" }}>
          <button
            type="button"
            data-ocid="onboarding.back_button"
            onClick={onBack}
            style={{
              fontSize: "0.85rem",
              padding: "0.4rem 0.875rem",
              borderRadius: "0.5rem",
              border: "1px solid oklch(0.85 0.012 70)",
              color: "oklch(0.50 0.015 60)",
              backgroundColor: "transparent",
              cursor: "pointer",
              transition: "all 0.15s ease",
              fontFamily: "Figtree, system-ui, sans-serif",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.94 0.008 75)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "oklch(0.72 0.15 50 / 0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "oklch(0.85 0.012 70)";
            }}
          >
            ← Back
          </button>
        </div>

        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.65rem",
              marginBottom: "0.75rem",
            }}
          >
            <BrainWarmupMark />
            <h1
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "2.25rem",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "oklch(0.22 0.02 55)",
                margin: 0,
              }}
            >
              Brain Warmup
            </h1>
          </div>
          <div
            style={{
              display: "inline-block",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.3rem 0.875rem",
              borderRadius: "999px",
              backgroundColor: "oklch(0.72 0.15 50 / 0.10)",
              color: "oklch(0.50 0.12 55)",
              border: "1px solid oklch(0.72 0.15 50 / 0.22)",
            }}
          >
            Welcome
          </div>
        </div>

        {/* Intro card */}
        <div
          style={{
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            backgroundColor: "oklch(0.96 0.008 75)",
            border: "1px solid oklch(0.88 0.012 70)",
          }}
        >
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "oklch(0.40 0.015 60)",
              fontFamily: "Figtree, system-ui, sans-serif",
            }}
          >
            Brain Warmup helps you practice math at your own pace. It is
            designed for people whose brains work differently with numbers — and
            that is completely okay.
          </p>
        </div>

        {/* Module list */}
        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(0.55 0.015 60)",
              marginBottom: "0.75rem",
              fontFamily: "Figtree, system-ui, sans-serif",
            }}
          >
            What is inside
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            {MODULE_DESCRIPTIONS.map((mod) => (
              <div
                key={mod.name}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  borderRadius: "0.625rem",
                  padding: "0.625rem 1rem",
                  backgroundColor: "oklch(0.99 0.003 75)",
                  border: "1px solid oklch(0.90 0.008 70)",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    marginTop: "0.45rem",
                    flexShrink: 0,
                    backgroundColor: mod.accent,
                  }}
                />
                <div>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "oklch(0.25 0.02 55)",
                      fontFamily: "Fraunces, Georgia, serif",
                    }}
                  >
                    {mod.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "oklch(0.55 0.015 60)",
                      marginLeft: "0.5rem",
                      fontFamily: "Figtree, system-ui, sans-serif",
                    }}
                  >
                    — {mod.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.875rem",
          }}
        >
          <button
            type="button"
            data-ocid="onboarding.primary_button"
            onClick={onDone}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "0.875rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background:
                "linear-gradient(135deg, oklch(0.65 0.15 50) 0%, oklch(0.52 0.14 190) 100%)",
              color: "oklch(0.99 0.003 75)",
              transition: "all 0.2s ease",
              fontFamily: "Figtree, system-ui, sans-serif",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 8px 24px oklch(0.65 0.15 50 / 0.30)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            Start exploring
          </button>
          <button
            type="button"
            data-ocid="onboarding.secondary_button"
            onClick={onDone}
            style={{
              fontSize: "0.875rem",
              color: "oklch(0.55 0.015 60)",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.15s",
              fontFamily: "Figtree, system-ui, sans-serif",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.40 0.02 55)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.55 0.015 60)";
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
