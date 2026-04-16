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
    accent: "oklch(0.72 0.18 280)",
  },
  {
    name: "Arithmetic",
    description: "Step-by-step addition and subtraction with visual support.",
    accent: "oklch(0.72 0.18 190)",
  },
  {
    name: "Money & Real Life",
    description: "Count coins, read receipts, and make change.",
    accent: "oklch(0.72 0.16 70)",
  },
  {
    name: "Time & Scheduling",
    description: "Read clocks, navigate calendars, and track elapsed time.",
    accent: "oklch(0.68 0.16 220)",
  },
  {
    name: "Counting & Sequences",
    description: "Fill in patterns and explore place value.",
    accent: "oklch(0.72 0.16 75)",
  },
  {
    name: "Number Line",
    description: "Place numbers in space — a core skill for number sense.",
    accent: "oklch(0.70 0.18 330)",
  },
  {
    name: "Estimation",
    description: "Judge quantities at a glance without counting every one.",
    accent: "oklch(0.68 0.16 195)",
  },
  {
    name: "Step-by-Step Sequencing",
    description: "Break multi-step problems into clear, ordered actions.",
    accent: "oklch(0.68 0.16 175)",
  },
  {
    name: "Fractions",
    description:
      "Understand halves, quarters, and eighths with visual fraction bars.",
    accent: "oklch(0.72 0.18 130)",
  },
  {
    name: "Measurement",
    description:
      "Read rulers, scales, and measuring cups in everyday contexts.",
    accent: "oklch(0.68 0.16 210)",
  },
  {
    name: "Breathe & Grow",
    description: "A short breathing exercise for when math feels overwhelming.",
    accent: "oklch(0.70 0.15 0)",
  },
];

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
        backgroundColor: "oklch(0.11 0.01 260)",
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
              border: "1px solid oklch(0.28 0.015 260)",
              color: "oklch(0.55 0.01 260)",
              backgroundColor: "transparent",
              cursor: "pointer",
              transition: "all 0.15s ease",
              fontFamily: "Space Grotesk, system-ui, sans-serif",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.18 0.015 260)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.72 0.18 190)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "oklch(0.72 0.18 190 / 0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.55 0.01 260)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "oklch(0.28 0.015 260)";
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
            <svg
              width="40"
              height="40"
              viewBox="0 0 36 36"
              fill="none"
              aria-hidden="true"
            >
              <rect
                width="36"
                height="36"
                rx="10"
                fill="oklch(0.72 0.18 190 / 0.15)"
              />
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
            <h1
              style={{
                fontFamily: "Space Grotesk, system-ui, sans-serif",
                fontSize: "2.25rem",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "oklch(0.93 0.01 260)",
                margin: 0,
              }}
            >
              Studymore
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
              backgroundColor: "oklch(0.72 0.18 190 / 0.12)",
              color: "oklch(0.72 0.18 190)",
              border: "1px solid oklch(0.72 0.18 190 / 0.25)",
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
            backgroundColor: "oklch(0.17 0.015 260)",
            border: "1px solid oklch(0.28 0.015 260)",
          }}
        >
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "oklch(0.72 0.01 260)",
            }}
          >
            Studymore helps you practice math at your own pace. It is designed
            for people whose brains work differently with numbers — and that is
            completely okay.
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
              color: "oklch(0.40 0.01 260)",
              marginBottom: "0.75rem",
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
                  backgroundColor: "oklch(0.16 0.015 260)",
                  border: "1px solid oklch(0.24 0.015 260)",
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
                      color: "oklch(0.85 0.01 260)",
                      fontFamily: "Space Grotesk, system-ui, sans-serif",
                    }}
                  >
                    {mod.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "oklch(0.48 0.01 260)",
                      marginLeft: "0.5rem",
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
              backgroundColor: "oklch(0.72 0.18 190)",
              color: "oklch(0.12 0.01 190)",
              transition: "all 0.2s ease",
              fontFamily: "Space Grotesk, system-ui, sans-serif",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.65 0.20 190)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 8px 24px oklch(0.72 0.18 190 / 0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.72 0.18 190)";
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
              color: "oklch(0.45 0.08 190)",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.72 0.18 190)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.45 0.08 190)";
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
