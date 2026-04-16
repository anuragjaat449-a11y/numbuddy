interface Props {
  steps: string[];
  accent: string;
  border: string;
  bg: string;
}

/**
 * StepStrip — a compact horizontal strip showing numbered procedural steps.
 * Sits at the top of a question card to orient the learner to the process.
 */
export default function StepStrip({ steps, accent, border, bg }: Props) {
  return (
    <ol
      className="flex items-center gap-1 w-full overflow-x-auto pb-1 mb-3 list-none m-0 p-0"
      aria-label="Steps in this problem"
    >
      {steps.map((step, i) => {
        // Use index-based key to handle steps with identical text safely
        const stepKey = `step-${i}-${step.length}`;
        return (
          <li key={stepKey} className="flex items-center gap-1 shrink-0">
            {/* Numbered bubble */}
            <div
              className="flex items-center justify-center rounded-full text-xs font-semibold"
              style={{
                width: 22,
                height: 22,
                backgroundColor: bg,
                border: `1.5px solid ${border}`,
                color: accent,
                fontFamily: "Figtree, sans-serif",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            {/* Step label */}
            <span
              className="text-xs leading-tight"
              style={{
                color: "oklch(0.45 0.04 55)",
                fontFamily: "Figtree, sans-serif",
                maxWidth: 80,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {step}
            </span>
            {/* Arrow connector (not after last item) */}
            {i < steps.length - 1 && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <polyline
                  points="3,2 9,6 3,10"
                  fill="none"
                  stroke={border}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </li>
        );
      })}
    </ol>
  );
}
