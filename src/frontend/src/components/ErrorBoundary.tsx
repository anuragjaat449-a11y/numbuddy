import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console in development only; no user-facing details
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ backgroundColor: "oklch(0.98 0.01 55)" }}
          data-ocid="error_boundary.panel"
        >
          {/* Warm SVG illustration */}
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="mb-6 opacity-70"
          >
            <circle cx="36" cy="36" r="32" fill="oklch(0.92 0.05 55)" />
            <text
              x="36"
              y="48"
              textAnchor="middle"
              fontSize="32"
              fill="oklch(0.55 0.08 55)"
              fontFamily="Space Grotesk, system-ui, sans-serif"
            >
              !
            </text>
          </svg>

          <h1
            className="text-2xl md:text-3xl font-medium mb-3"
            style={{
              fontFamily: "Space Grotesk, system-ui, sans-serif",
              color: "oklch(0.22 0.02 55)",
            }}
          >
            Something went wrong
          </h1>

          <p
            className="text-base leading-relaxed max-w-sm mb-8"
            style={{ color: "oklch(0.45 0.03 60)" }}
          >
            We&apos;re sorry about that. Please reload the page to continue.
          </p>

          <button
            type="button"
            data-ocid="error_boundary.primary_button"
            onClick={() => window.location.reload()}
            className="px-7 py-3 rounded-xl text-sm font-medium min-h-[48px] transition-colors"
            style={{
              backgroundColor: "oklch(0.45 0.12 250)",
              color: "oklch(0.98 0.01 250)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.38 0.13 250)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.45 0.12 250)";
            }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
