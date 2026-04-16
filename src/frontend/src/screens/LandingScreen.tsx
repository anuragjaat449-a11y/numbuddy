import { useEffect, useRef, useState } from "react";

interface Props {
  onEnter: () => void;
  onAssessment: () => void;
}

// ── Brand mark (Brain Warmup) ─────────────────────────────────────────────────
function BrainWarmupMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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
      {/* Warmth spark */}
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

// ── Demo cards ────────────────────────────────────────────────────────────────
const DEMO_CARDS = [
  {
    module: "Arithmetic",
    moduleColor: "oklch(0.38 0.10 200)",
    moduleBg: "oklch(0.38 0.10 200 / 0.10)",
    question: "What is 7 + 5?",
    choices: ["10", "12", "13", "11"],
    correct: 1,
  },
  {
    module: "Fractions",
    moduleColor: "oklch(0.40 0.10 140)",
    moduleBg: "oklch(0.40 0.10 140 / 0.10)",
    question: "Which fraction is bigger?",
    choices: ["1/4", "1/2", "1/3", "1/8"],
    correct: 1,
  },
  {
    module: "Money",
    moduleColor: "oklch(0.45 0.10 60)",
    moduleBg: "oklch(0.45 0.10 60 / 0.10)",
    question: "You have $1. You buy something for 65¢. How much change?",
    choices: ["25¢", "35¢", "45¢", "30¢"],
    correct: 1,
  },
  {
    module: "Number Line",
    moduleColor: "oklch(0.40 0.10 300)",
    moduleBg: "oklch(0.40 0.10 300 / 0.10)",
    question: "What number is halfway between 4 and 10?",
    choices: ["6", "7", "5", "8"],
    correct: 0,
  },
];

function DemoCard() {
  const [cardIndex, setCardIndex] = useState(0);
  const [highlighted, setHighlighted] = useState(false);
  const [visible, setVisible] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: cardIndex drives the animation cycle
  useEffect(() => {
    const highlightTimer = setTimeout(() => setHighlighted(true), 1500);
    const fadeTimer = setTimeout(() => setVisible(false), 2200);
    const nextTimer = setTimeout(() => {
      setCardIndex((prev) => (prev + 1) % DEMO_CARDS.length);
      setHighlighted(false);
      setVisible(true);
    }, 2600);

    return () => {
      clearTimeout(highlightTimer);
      clearTimeout(fadeTimer);
      clearTimeout(nextTimer);
    };
  }, [cardIndex]);

  const card = DEMO_CARDS[cardIndex];

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-12px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        backgroundColor: "oklch(1 0 0)",
        borderRadius: "1.25rem",
        padding: "1.5rem",
        boxShadow: "0 4px 24px oklch(0.22 0.02 55 / 0.10)",
        border: "1px solid oklch(0.88 0.012 70)",
        maxWidth: "380px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "inline-block",
          backgroundColor: card.moduleBg,
          color: card.moduleColor,
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "0.2rem 0.65rem",
          borderRadius: "999px",
          marginBottom: "0.85rem",
        }}
      >
        {card.module}
      </div>

      <p
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "1.05rem",
          fontWeight: 500,
          color: "oklch(0.22 0.02 55)",
          marginBottom: "1rem",
          lineHeight: 1.4,
        }}
      >
        {card.question}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
        }}
      >
        {card.choices.map((choice, i) => {
          const isCorrect = i === card.correct;
          const isHighlighted = highlighted && isCorrect;
          return (
            <div
              key={choice}
              style={{
                padding: "0.6rem 0.5rem",
                borderRadius: "0.75rem",
                textAlign: "center",
                fontSize: "0.9rem",
                fontWeight: 500,
                border: `1.5px solid ${
                  isHighlighted ? card.moduleColor : "oklch(0.88 0.012 70)"
                }`,
                backgroundColor: isHighlighted
                  ? card.moduleBg
                  : "oklch(0.97 0.006 75)",
                color: isHighlighted
                  ? card.moduleColor
                  : "oklch(0.50 0.015 60)",
                transition: "all 0.3s ease",
                transform: isHighlighted ? "scale(1.04)" : "scale(1)",
              }}
            >
              {choice}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Scroll dot nav ────────────────────────────────────────────────────────────
function DotNav({
  active,
  onDotClick,
}: { active: number; onDotClick: (i: number) => void }) {
  const labels = ["Hero section", "Features section", "Get started section"];
  return (
    <nav
      aria-label="Page sections"
      style={{
        position: "fixed",
        right: "1.25rem",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
      }}
    >
      {[0, 1, 2].map((i) => (
        <button
          key={i}
          type="button"
          aria-label={labels[i]}
          data-ocid={`landing.dot_nav.${i + 1}`}
          onClick={() => onDotClick(i)}
          style={{
            width: active === i ? "10px" : "8px",
            height: active === i ? "10px" : "8px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            backgroundColor:
              active === i ? "oklch(0.28 0.025 55)" : "oklch(0.75 0.012 70)",
            opacity: active === i ? 1 : 0.6,
            padding: 0,
            transition: "all 0.25s ease",
          }}
        />
      ))}
    </nav>
  );
}

// ── Feature icons ─────────────────────────────────────────────────────────────
function IconConfidence() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 27 L16 9"
        stroke="oklch(0.38 0.10 200)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M9 16 L16 9 L23 16"
        stroke="oklch(0.38 0.10 200)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="24"
        cy="8"
        r="2.5"
        fill="oklch(0.38 0.10 200)"
        opacity="0.5"
      />
      <circle cx="24" cy="8" r="1.2" fill="oklch(0.38 0.10 200)" />
    </svg>
  );
}

function IconCalm() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 26 C16 26 6 19.5 6 12.5 C6 8.91 8.91 6 12.5 6 C14.2 6 15.7 6.7 16.8 7.8 C17.9 6.7 19.4 6 21.1 6 C24.69 6 27.6 8.91 27.6 12.5 C27.6 19.5 16 26 16 26 Z"
        stroke="oklch(0.45 0.10 60)"
        strokeWidth="2"
        fill="oklch(0.45 0.10 60 / 0.12)"
        strokeLinejoin="round"
      />
      <path
        d="M11 15 Q13.5 18.5 16 18.5 Q18.5 18.5 21 15"
        stroke="oklch(0.45 0.10 60)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function IconTrack() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="19"
        width="6"
        height="8"
        rx="1.5"
        fill="oklch(0.40 0.10 300)"
      />
      <rect
        x="13"
        y="13"
        width="6"
        height="14"
        rx="1.5"
        fill="oklch(0.40 0.10 300)"
        opacity="0.7"
      />
      <rect
        x="22"
        y="7"
        width="6"
        height="20"
        rx="1.5"
        fill="oklch(0.40 0.10 300)"
        opacity="0.5"
      />
      <path
        d="M7 16 L16 10 L25 5"
        stroke="oklch(0.40 0.10 300)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="2.5 2"
      />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LandingScreen({ onEnter, onAssessment }: Props) {
  const [activeSection, setActiveSection] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = [
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
  ];

  // biome-ignore lint/correctness/useExhaustiveDependencies: sectionRefs are stable
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (let i = 0; i < sectionRefs.length; i++) {
      const ref = sectionRefs[i];
      if (!ref.current) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(i);
        },
        { root: scrollRef.current, threshold: 0.6 },
      );
      obs.observe(ref.current);
      observers.push(obs);
    }
    return () => {
      for (const o of observers) o.disconnect();
    };
  }, []);

  const scrollToSection = (i: number) => {
    sectionRefs[i].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: activeSection and scrollToSection are used inside
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        scrollToSection(Math.min(activeSection + 1, sectionRefs.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToSection(Math.max(activeSection - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeSection]);

  return (
    <>
      <DotNav active={activeSection} onDotClick={scrollToSection} />

      <div
        ref={scrollRef}
        style={{
          height: "100dvh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
        }}
      >
        {/* ── Section 1: Hero ─────────────────────────────────────────────── */}
        <section
          ref={sectionRefs[0] as React.RefObject<HTMLElement>}
          style={{
            height: "100dvh",
            scrollSnapAlign: "start",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            backgroundColor: "oklch(0.98 0.006 75)",
          }}
        >
          {/* Left pane */}
          <div
            className="landing-hero-left"
            style={{
              flex: "0 0 55%",
              backgroundColor: "oklch(0.98 0.006 75)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding:
                "clamp(2rem, 5vw, 4.5rem) clamp(2rem, 5vw, 4rem) clamp(2rem, 5vw, 4.5rem) clamp(2.5rem, 6vw, 5rem)",
            }}
          >
            {/* Brand */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                marginBottom: "2.5rem",
              }}
            >
              <BrainWarmupMark size={42} />
              <span
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "clamp(1.4rem, 2.5vw, 1.75rem)",
                  fontWeight: 700,
                  color: "oklch(0.22 0.02 55)",
                  letterSpacing: "-0.02em",
                }}
              >
                Brain Warmup
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "oklch(0.22 0.02 55)",
                marginBottom: "1.25rem",
                letterSpacing: "-0.03em",
              }}
            >
              Math practice that{" "}
              <span style={{ color: "oklch(0.38 0.10 200)" }}>actually</span>{" "}
              feels good
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontFamily: "Figtree, system-ui, sans-serif",
                fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                lineHeight: 1.65,
                color: "oklch(0.55 0.015 60)",
                marginBottom: "2.5rem",
                maxWidth: "38ch",
              }}
            >
              Short, friendly sessions at your own pace. No timers. No pressure.
              Just you and the numbers.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
                alignItems: "flex-start",
              }}
            >
              <button
                type="button"
                data-ocid="landing.assessment_button"
                onClick={onAssessment}
                style={{
                  minHeight: "52px",
                  padding: "0 2.25rem",
                  borderRadius: "0.875rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.15 50) 0%, oklch(0.52 0.14 190) 100%)",
                  color: "oklch(0.99 0.003 75)",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 8px 24px oklch(0.65 0.15 50 / 0.28)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "none";
                }}
              >
                Start the Assessment →
              </button>
              <button
                type="button"
                data-ocid="landing.start_button"
                onClick={onEnter}
                style={{
                  minHeight: "52px",
                  padding: "0 1.75rem",
                  borderRadius: "0.875rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  border: "1.5px solid oklch(0.80 0.012 70)",
                  color: "oklch(0.45 0.015 60)",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "oklch(0.28 0.025 55)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.28 0.025 55)";
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "oklch(0.28 0.025 55 / 0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "oklch(0.80 0.012 70)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.45 0.015 60)";
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "transparent";
                }}
              >
                Explore modules
              </button>
            </div>
          </div>

          {/* Right pane — demo */}
          <div
            className="landing-hero-right"
            style={{
              flex: "0 0 45%",
              backgroundColor: "oklch(0.96 0.008 75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              borderLeft: "1px solid oklch(0.88 0.012 70)",
            }}
          >
            {/* Subtle dot pattern */}
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0.35,
              }}
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="grid-hero"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1" cy="1" r="1" fill="oklch(0.75 0.012 70)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-hero)" />
            </svg>

            {/* Warm glow */}
            <div
              style={{
                position: "absolute",
                top: "30%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, oklch(0.60 0.10 70 / 0.12) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                maxWidth: "400px",
                padding: "2rem",
              }}
            >
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "oklch(0.55 0.015 60)",
                  marginBottom: "1.25rem",
                }}
              >
                Live preview
              </p>
              <DemoCard />
            </div>
          </div>
        </section>

        {/* ── Section 2: Features ──────────────────────────────────────────── */}
        <section
          ref={sectionRefs[1] as React.RefObject<HTMLElement>}
          className="features-section"
          style={{
            height: "100dvh",
            scrollSnapAlign: "start",
            overflow: "hidden",
            backgroundColor: "oklch(1 0 0)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)",
            borderTop: "1px solid oklch(0.88 0.012 70)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "oklch(0.28 0.025 55 / 0.08)",
              color: "oklch(0.28 0.025 55)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.3rem 0.9rem",
              borderRadius: "999px",
              marginBottom: "1.25rem",
              border: "1px solid oklch(0.28 0.025 55 / 0.20)",
            }}
          >
            Built for every learner
          </div>

          <h2
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 700,
              color: "oklch(0.22 0.02 55)",
              marginBottom: "clamp(2rem, 4vw, 3.5rem)",
              textAlign: "center",
              letterSpacing: "-0.025em",
            }}
          >
            Everything a learner needs
          </h2>

          <div
            className="features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
              maxWidth: "1000px",
              width: "100%",
            }}
          >
            {[
              {
                Icon: IconConfidence,
                title: "Build real confidence",
                desc: "Short sessions build fluency without the stress. Progress feels earned.",
                accent: "oklch(0.38 0.10 200)",
                iconBg: "oklch(0.38 0.10 200 / 0.10)",
              },
              {
                Icon: IconCalm,
                title: "Stay calm and focused",
                desc: "Anxiety check-ins and breathing exercises keep every session feeling safe.",
                accent: "oklch(0.45 0.10 60)",
                iconBg: "oklch(0.45 0.10 60 / 0.10)",
              },
              {
                Icon: IconTrack,
                title: "Track what matters",
                desc: "See exactly which skills are growing and adjust difficulty as you go.",
                accent: "oklch(0.40 0.10 300)",
                iconBg: "oklch(0.40 0.10 300 / 0.10)",
              },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  backgroundColor: "oklch(0.98 0.006 75)",
                  borderRadius: "1.25rem",
                  padding: "2rem",
                  border: "1px solid oklch(0.88 0.012 70)",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "0.875rem",
                    backgroundColor: f.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.1rem",
                    border: `1px solid ${f.accent.replace(")", " / 0.18)")}`,
                  }}
                >
                  <f.Icon />
                </div>
                <h3
                  style={{
                    fontFamily: "Fraunces, Georgia, serif",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "oklch(0.22 0.02 55)",
                    marginBottom: "0.55rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    color: "oklch(0.55 0.015 60)",
                    fontFamily: "Figtree, system-ui, sans-serif",
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Final CTA ─────────────────────────────────────────── */}
        <section
          ref={sectionRefs[2] as React.RefObject<HTMLElement>}
          style={{
            height: "100dvh",
            scrollSnapAlign: "start",
            overflow: "hidden",
            backgroundColor: "oklch(0.96 0.008 75)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)",
            position: "relative",
            borderTop: "1px solid oklch(0.88 0.012 70)",
          }}
        >
          {/* Background warm glow */}
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, oklch(0.60 0.10 70 / 0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <BrainWarmupMark size={56} />

          <h2
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "oklch(0.22 0.02 55)",
              textAlign: "center",
              letterSpacing: "-0.03em",
              marginTop: "1.5rem",
              marginBottom: "1rem",
              maxWidth: "18ch",
              lineHeight: 1.15,
              position: "relative",
            }}
          >
            Ready to feel good about{" "}
            <span style={{ color: "oklch(0.38 0.10 200)" }}>numbers?</span>
          </h2>

          <p
            style={{
              fontFamily: "Figtree, system-ui, sans-serif",
              fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
              color: "oklch(0.55 0.015 60)",
              textAlign: "center",
              maxWidth: "42ch",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              position: "relative",
            }}
          >
            Take a 2-minute assessment and we&apos;ll find the perfect starting
            point for you.
          </p>

          <button
            type="button"
            data-ocid="landing.final_assessment_button"
            onClick={onAssessment}
            style={{
              minHeight: "56px",
              padding: "0 2.75rem",
              borderRadius: "0.875rem",
              fontSize: "1.05rem",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background:
                "linear-gradient(135deg, oklch(0.65 0.15 50) 0%, oklch(0.52 0.14 190) 100%)",
              color: "oklch(0.99 0.003 75)",
              transition: "all 0.2s ease",
              letterSpacing: "-0.01em",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-2px) scale(1.02)";
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 12px 32px oklch(0.65 0.15 50 / 0.28)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "none";
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            Take the Free Assessment
          </button>

          {/* Footer */}
          <p
            style={{
              position: "absolute",
              bottom: "1.75rem",
              fontSize: "0.75rem",
              color: "oklch(0.60 0.015 60)",
              textAlign: "center",
              lineHeight: "1.6",
            }}
          >
            Made with ❤️ by{" "}
            <a
              href="https://www.instagram.com/anurag_singh.indoliya?igsh=MWFjcmJoYzZmN3Iwbw=="
              target="_blank"
              rel="noreferrer"
              style={{
                color: "oklch(0.38 0.06 50)",
                textDecoration: "none",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.textDecoration =
                  "underline";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.textDecoration =
                  "none";
              }}
            >
              anurag_singh.indoliya
            </a>
          </p>
        </section>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .landing-hero-left {
            flex: unset !important;
            width: 100% !important;
            padding: 2.5rem 1.75rem !important;
          }
          .landing-hero-right {
            display: none !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
            overflow-y: auto;
          }
          .features-section {
            overflow-y: auto !important;
            height: auto !important;
            min-height: 100dvh;
          }
        }
      `}</style>
    </>
  );
}
