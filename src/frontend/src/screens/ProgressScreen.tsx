import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useEffect, useState } from "react";
import { timeAgo as timeAgoUtil } from "../utils/dateUtils";
import { MODULE_LIST, moduleColor } from "../utils/modules";
import {
  type SessionActor,
  getModuleStats,
  getModuleTrend,
  getSparklineData,
  getStreak,
  syncProgressFromBackend,
} from "../utils/progress";

interface Props {
  onBack: () => void;
  actor?: SessionActor;
}

const MODULES = MODULE_LIST.filter((m) => !m.isBreathing).map((m) => ({
  id: m.id,
  name: m.label,
  accent: moduleColor(m.id, 0.55, 0.15),
  bg: moduleColor(m.id, 0.94, 0.04),
  border: moduleColor(m.id, 0.8, 0.08),
}));

function timeAgo(dateStr: string): string {
  return timeAgoUtil(dateStr);
}

function getMotivationalMessage(totalSessions: number): string {
  if (totalSessions >= 15)
    return "Consistent practice. That\u2019s the secret.";
  if (totalSessions >= 5) return "You\u2019re building a habit. Keep going.";
  return "Great start \u2014 every session counts.";
}

// ─── SVG Indicators ──────────────────────────────────────────────────────────

function FlameIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 13C4.24 13 2 10.87 2 8.25c0-1.95 1.12-3.6 2.5-4.75C4.5 5 5 5.5 5.5 5.5c0-2 1-3.5 2.5-4.5 0 1.5.5 2.5 1.5 3 .5-1 .5-1.5.5-1.5C11 3.5 12 5.5 12 8.25 12 10.87 9.76 13 7 13z"
        fill="oklch(0.72 0.18 55)"
      />
      <path
        d="M7 11.5c-1.38 0-2.5-1.12-2.5-2.5 0-.95.55-1.75 1.25-2.25C5.75 7.5 6 8 6.5 8c0-1 .5-1.75 1.5-2.25 0 .75.25 1.25.75 1.5.25-.5.25-.75.25-.75C9.5 7 10 8 10 9c0 1.38-1.12 2.5-2.5 2.5z"
        fill="oklch(0.88 0.14 60)"
      />
    </svg>
  );
}

function TrendArrowUp() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-label="Improving"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 12V4M4.5 7.5L8 4l3.5 3.5"
        stroke="oklch(0.50 0.16 150)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendArrowDown() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-label="Needs attention"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 4v8M4.5 8.5L8 12l3.5-3.5"
        stroke="oklch(0.62 0.16 55)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendArrowStable() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-label="Steady"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 8h8M9.5 5.5L12 8l-2.5 2.5"
        stroke="oklch(0.40 0.04 55)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Sparkline({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  if (data.length < 2) return null;

  const W = 60;
  const H = 24;
  const padding = 2;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (W - padding * 2);
    const y = H - padding - ((v - minVal) / range) * (H - padding * 2);
    return `${x},${y}`;
  });

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />
      {/* Last point dot */}
      <circle
        cx={points[points.length - 1].split(",")[0]}
        cy={points[points.length - 1].split(",")[1]}
        r="2"
        fill={color}
      />
    </svg>
  );
}

export default function ProgressScreen({ onBack, actor }: Props) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!actor || !isAuthenticated) return;
    syncProgressFromBackend(actor)
      .then(() => {
        setRefreshKey((k) => k + 1);
      })
      .catch(() => {});
  }, [actor, isAuthenticated]);

  // refreshKey is used to trigger re-render after backend sync
  void refreshKey;

  const streak = getStreak();

  const statsEntries = MODULES.map((mod) => ({
    mod,
    stats: getModuleStats(mod.id),
    trend: getModuleTrend(mod.id),
    sparkline: getSparklineData(mod.id),
  }));

  const hasAny = statsEntries.some((e) => e.stats.sessions.length > 0);
  const activeEntries = statsEntries.filter((e) => e.stats.sessions.length > 0);

  const totalSessions = statsEntries.reduce(
    (sum, e) => sum + e.stats.sessions.length,
    0,
  );

  const lastPlayedEntry = statsEntries
    .filter((e) => e.stats.lastPlayed)
    .sort(
      (a, b) =>
        new Date(b.stats.lastPlayed!).getTime() -
        new Date(a.stats.lastPlayed!).getTime(),
    )[0];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 px-4 pt-8 pb-4 max-w-2xl md:max-w-3xl mx-auto w-full">
        <button
          type="button"
          data-ocid="progress.back_button"
          onClick={onBack}
          className="text-sm px-3 py-2 rounded-md border transition-colors min-h-[44px]"
          style={{
            borderColor: "oklch(0.82 0.04 55)",
            color: "oklch(0.45 0.05 55)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "oklch(0.96 0.02 55)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent";
          }}
        >
          ← Back
        </button>
        <h1
          className="text-2xl md:text-3xl font-medium tracking-tight"
          style={{
            fontFamily: "Space Grotesk, system-ui, sans-serif",
            color: "oklch(0.22 0.02 55)",
          }}
        >
          Your Progress
        </h1>
      </header>

      {/* Sync status banner */}
      <div className="max-w-2xl md:max-w-3xl mx-auto w-full px-4 pb-2">
        {isAuthenticated ? (
          <div
            data-ocid="progress.success_state"
            className="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5"
            style={{
              backgroundColor: "oklch(0.93 0.04 250)",
              color: "oklch(0.38 0.10 250)",
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="5" cy="5" r="4" fill="oklch(0.45 0.12 250)" />
              <path
                d="M3 5l1.5 1.5L7 3.5"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Synced to your account
          </div>
        ) : (
          <div
            data-ocid="progress.loading_state"
            className="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5"
            style={{
              backgroundColor: "oklch(0.94 0.02 55)",
              color: "oklch(0.55 0.04 55)",
            }}
          >
            Sign in to save your progress across devices
          </div>
        )}
      </div>

      <main className="flex-1 max-w-2xl md:max-w-3xl mx-auto w-full px-4 pb-10">
        {!hasAny ? (
          <div
            data-ocid="progress.empty_state"
            className="mt-10 text-center px-6 py-10 rounded-xl border"
            style={{
              borderColor: "oklch(0.88 0.03 55)",
              backgroundColor: "oklch(0.97 0.01 55)",
            }}
          >
            <p
              className="text-base md:text-lg"
              style={{ color: "oklch(0.45 0.04 55)" }}
            >
              No sessions yet.
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: "oklch(0.40 0.03 55)" }}
            >
              Start any module to track your progress here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-2">
            {/* Streak badge */}
            <div
              data-ocid="progress.card"
              className="rounded-xl border p-4 md:p-5 flex items-center justify-between flex-wrap gap-3"
              style={{
                backgroundColor: "oklch(0.96 0.03 55)",
                borderColor: "oklch(0.88 0.05 55)",
              }}
            >
              <div>
                <p
                  className="text-base font-medium mb-0.5"
                  style={{ color: "oklch(0.32 0.04 55)" }}
                >
                  {totalSessions} session{totalSessions !== 1 ? "s" : ""}{" "}
                  completed
                </p>
                <p
                  className="text-sm mb-1"
                  style={{ color: "oklch(0.50 0.03 55)" }}
                >
                  {getMotivationalMessage(totalSessions)}
                </p>
                {lastPlayedEntry && (
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.40 0.03 55)" }}
                  >
                    Last played:{" "}
                    <span style={{ color: "oklch(0.45 0.04 55)" }}>
                      {lastPlayedEntry.mod.name}
                    </span>{" "}
                    · {timeAgo(lastPlayedEntry.stats.lastPlayed!)}
                  </p>
                )}
              </div>

              {/* Streak pill */}
              {streak > 0 ? (
                <div
                  data-ocid="progress.panel"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: "oklch(0.92 0.10 75)",
                    color: "oklch(0.40 0.15 65)",
                  }}
                  aria-label={`${streak} day streak`}
                >
                  <FlameIcon />
                  {streak} day{streak !== 1 ? "s" : ""} in a row
                </div>
              ) : (
                <div
                  className="text-xs"
                  style={{ color: "oklch(0.42 0.04 55)" }}
                >
                  Start your streak today
                </div>
              )}
            </div>

            {/* Only show modules that have been started */}
            {activeEntries.map(({ mod, stats, trend, sparkline }, i) => (
              <div
                key={mod.id}
                data-ocid={`progress.item.${i + 1}`}
                className="rounded-xl border p-5 md:p-6"
                style={{
                  borderColor: mod.border,
                  backgroundColor: mod.bg,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2
                      className="text-base md:text-lg font-medium mb-0.5"
                      style={{ color: mod.accent }}
                    >
                      {mod.name}
                    </h2>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.03 55)" }}
                    >
                      {stats.sessions.length} session
                      {stats.sessions.length !== 1 ? "s" : ""} · Last played{" "}
                      {timeAgo(stats.lastPlayed!)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Sparkline */}
                    <Sparkline data={sparkline} color={mod.accent} />

                    {/* Trend arrow */}
                    <div className="flex-shrink-0">
                      {trend === "up" && <TrendArrowUp />}
                      {trend === "down" && <TrendArrowDown />}
                      {trend === "stable" && <TrendArrowStable />}
                    </div>

                    {/* Accuracy % */}
                    <div
                      className="text-xl md:text-2xl font-medium tabular-nums"
                      style={{ color: mod.accent }}
                    >
                      {stats.averageScore}%
                    </div>
                  </div>
                </div>

                <div
                  className="mt-3 h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "oklch(1 0 0 / 0.5)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${stats.averageScore}%`,
                      backgroundColor: mod.accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
