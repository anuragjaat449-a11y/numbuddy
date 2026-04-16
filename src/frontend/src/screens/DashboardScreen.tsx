import { useCallback, useEffect, useRef, useState } from "react";
import { useLearner } from "../context/LearnerContext";
import { timeAgo as timeAgoUtil } from "../utils/dateUtils";
import { MODULE_LIST, moduleColor } from "../utils/modules";
import { getAllStats, getModuleStats } from "../utils/progress";
import type { SessionRecord } from "../utils/progress";

interface Props {
  onBack: () => void;
}

const PIN_KEY = "numbuddy_dashboard_pin";

const QUIZ_MODULES = MODULE_LIST.filter((m) => m.id !== "calm").map((m) => ({
  id: m.id,
  name: m.label,
  accent: moduleColor(m.id, 0.5, 0.15),
  bg: moduleColor(m.id, 0.94, 0.04),
  border: moduleColor(m.id, 0.82, 0.07),
  dot: moduleColor(m.id, 0.55, 0.15),
}));

type PinState = "locked" | "setting" | "confirming" | "unlocked";

function timeAgo(dateStr: string): string {
  return timeAgoUtil(dateStr);
}
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function formatPrintDate(): string {
  const now = new Date();
  return now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── PIN Keypad ───────────────────────────────────────────────────────────────

function PinDots({ value }: { value: string }) {
  return (
    <div className="flex gap-3 justify-center mb-6">
      {(["a", "b", "c", "d"] as const).map((k) => (
        <div
          key={k}
          className="w-4 h-4 rounded-full transition-colors"
          style={{
            backgroundColor:
              ["a", "b", "c", "d"].indexOf(k) < value.length
                ? "oklch(0.45 0.12 280)"
                : "oklch(0.87 0.03 55)",
          }}
        />
      ))}
    </div>
  );
}

function Keypad({
  onDigit,
  onDelete,
}: {
  onDigit: (d: string) => void;
  onDelete: () => void;
}) {
  const rows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [" ", "0", "⌫"],
  ];
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
    >
      {rows.flat().map((key) => {
        if (key === " ") return <div key="keypad-spacer" />;
        const isDelete = key === "⌫";
        return (
          <button
            key={key}
            type="button"
            data-ocid={isDelete ? "pin.delete_button" : `pin.digit_${key}`}
            onClick={() => (isDelete ? onDelete() : onDigit(key))}
            className="rounded-xl text-lg font-medium transition-colors min-h-[56px]"
            style={{
              backgroundColor: isDelete
                ? "oklch(0.91 0.03 55)"
                : "oklch(0.96 0.01 55)",
              color: isDelete ? "oklch(0.45 0.05 55)" : "oklch(0.22 0.02 55)",
              border: "1px solid oklch(0.88 0.03 55)",
            }}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}

// ─── PIN Gate ─────────────────────────────────────────────────────────────────

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const storedPin = localStorage.getItem(PIN_KEY);
  const isNew = !storedPin;

  const [phase, setPhase] = useState<"enter" | "set" | "confirm">(
    isNew ? "set" : "enter",
  );
  const [input, setInput] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const addDigit = useCallback(
    (d: string) => {
      if (input.length >= 4) return;
      const next = input + d;
      setInput(next);
      setError("");

      if (next.length === 4) {
        setTimeout(() => {
          if (phase === "set") {
            setFirstPin(next);
            setInput("");
            setPhase("confirm");
          } else if (phase === "confirm") {
            if (next === firstPin) {
              localStorage.setItem(PIN_KEY, next);
              onUnlock();
            } else {
              setError("PINs don't match. Try again.");
              setInput("");
              setPhase("set");
              setFirstPin("");
            }
          } else {
            // enter
            if (next === storedPin) {
              onUnlock();
            } else {
              const newAttempts = attempts + 1;
              setAttempts(newAttempts);
              setInput("");
              if (newAttempts >= 3) {
                setShowReset(true);
                setError("Wrong PIN. Too many attempts.");
              } else {
                setError(
                  `Wrong PIN. ${3 - newAttempts} attempt${3 - newAttempts !== 1 ? "s" : ""} left.`,
                );
              }
            }
          }
        }, 80);
      }
    },
    [input, phase, firstPin, storedPin, attempts, onUnlock],
  );

  const deleteDigit = useCallback(() => {
    setInput((p) => p.slice(0, -1));
    setError("");
  }, []);

  const handleReset = useCallback(() => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    // Full reset: remove pin, remove all profiles and their progress
    localStorage.removeItem(PIN_KEY);
    localStorage.removeItem("numbuddy_profiles");
    localStorage.removeItem("numbuddy_active_profile");
    // Reload so state is fresh
    window.location.reload();
  }, [resetConfirm]);

  const title =
    phase === "set"
      ? "Create a PIN"
      : phase === "confirm"
        ? "Confirm your PIN"
        : "Parent & Teacher View";
  const subtitle =
    phase === "set"
      ? "Choose a 4-digit PIN to protect this dashboard."
      : phase === "confirm"
        ? "Enter the same PIN again to confirm."
        : "Enter your 4-digit PIN to continue.";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "oklch(0.97 0.01 55)" }}
    >
      <div
        className="w-full max-w-xs rounded-2xl p-8"
        style={{
          backgroundColor: "oklch(0.99 0.01 55)",
          border: "1px solid oklch(0.88 0.03 55)",
        }}
      >
        {/* Lock icon SVG */}
        <div className="flex justify-center mb-4">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="8"
              y="18"
              width="24"
              height="18"
              rx="4"
              fill="oklch(0.88 0.04 280)"
            />
            <path
              d="M13 18v-5a7 7 0 0114 0v5"
              stroke="oklch(0.45 0.10 280)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="20" cy="27" r="2.5" fill="oklch(0.45 0.10 280)" />
          </svg>
        </div>

        <h1
          className="text-xl font-medium text-center mb-1"
          style={{
            fontFamily: "Space Grotesk, system-ui, sans-serif",
            color: "oklch(0.22 0.02 55)",
          }}
        >
          {title}
        </h1>
        <p
          className="text-sm text-center mb-6"
          style={{ color: "oklch(0.55 0.03 55)" }}
        >
          {subtitle}
        </p>

        <PinDots value={input} />

        {error && (
          <p
            data-ocid="pin.error_state"
            className="text-sm text-center mb-4"
            style={{ color: "oklch(0.50 0.18 25)" }}
          >
            {error}
          </p>
        )}

        <Keypad onDigit={addDigit} onDelete={deleteDigit} />

        {showReset && !resetConfirm && (
          <div className="mt-5 text-center">
            <button
              type="button"
              data-ocid="pin.reset_button"
              onClick={handleReset}
              className="text-sm underline"
              style={{ color: "oklch(0.50 0.10 25)" }}
            >
              Forgot PIN? Reset dashboard
            </button>
          </div>
        )}

        {resetConfirm && (
          <div
            className="mt-5 rounded-xl p-4"
            style={{
              backgroundColor: "oklch(0.96 0.04 25)",
              border: "1px solid oklch(0.85 0.08 25)",
            }}
          >
            <p
              className="text-sm mb-3"
              style={{ color: "oklch(0.35 0.08 25)" }}
            >
              This will remove all learner profiles and their progress. Are you
              sure?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="pin.confirm_button"
                onClick={handleReset}
                className="flex-1 py-2 rounded-lg text-sm font-medium min-h-[44px]"
                style={{
                  backgroundColor: "oklch(0.50 0.18 25)",
                  color: "oklch(0.98 0.01 25)",
                }}
              >
                Yes, reset
              </button>
              <button
                type="button"
                data-ocid="pin.cancel_button"
                onClick={() => setResetConfirm(false)}
                className="flex-1 py-2 rounded-lg text-sm min-h-[44px]"
                style={{
                  backgroundColor: "oklch(0.91 0.02 55)",
                  color: "oklch(0.45 0.04 55)",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sessions-per-week SVG chart ──────────────────────────────────────────────

function SessionsBarChart({ profileId }: { profileId: string }) {
  const now = new Date();
  // Build 8 week buckets, from oldest to newest
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const weekIndex = 7 - i; // 7 = oldest, 0 = current
    const end = new Date(now);
    end.setDate(end.getDate() - weekIndex * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 7);
    let label: string;
    if (weekIndex === 0) label = "Now";
    else if (weekIndex === 1) label = "1w";
    else label = `${weekIndex}w`;
    return { start, end, label };
  });

  // Count all sessions across all modules for each week
  const allStats = getAllStats(profileId);
  const counts = weeks.map(({ start, end }) => {
    let count = 0;
    for (const stats of Object.values(allStats)) {
      count += stats.sessions.filter((s) => {
        const d = new Date(s.date).getTime();
        return d >= start.getTime() && d < end.getTime();
      }).length;
    }
    return count;
  });

  const maxCount = Math.max(...counts, 1);
  const allZero = counts.every((c) => c === 0);

  const chartW = 400;
  const chartH = 140;
  const padLeft = 8;
  const padRight = 8;
  const padBottom = 28;
  const padTop = 8;
  const barAreaW = chartW - padLeft - padRight;
  const barAreaH = chartH - padBottom - padTop;
  const barCount = weeks.length;
  const barSlotW = barAreaW / barCount;
  const barW = Math.max(barSlotW * 0.55, 12);

  if (allZero) {
    return (
      <div
        className="flex items-center justify-center rounded-lg"
        style={{
          height: "80px",
          backgroundColor: "oklch(0.95 0.01 55)",
          color: "oklch(0.60 0.02 55)",
          fontSize: "0.85rem",
        }}
      >
        No sessions yet
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${chartW} ${chartH}`}
      width="100%"
      height={chartH}
      aria-label="Sessions per week bar chart"
      role="img"
    >
      {counts.map((count, i) => {
        const barH = (count / maxCount) * barAreaH;
        const x = padLeft + i * barSlotW + (barSlotW - barW) / 2;
        const y = padTop + barAreaH - barH;
        const labelX = padLeft + i * barSlotW + barSlotW / 2;
        const labelY = chartH - 6;
        return (
          <g key={weeks[i].label}>
            {barH > 0 && (
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={3}
                fill="oklch(0.55 0.10 55)"
              />
            )}
            {barH === 0 && (
              <rect
                x={x}
                y={padTop + barAreaH - 3}
                width={barW}
                height={3}
                rx={1.5}
                fill="oklch(0.88 0.02 55)"
              />
            )}
            {count > 0 && (
              <text
                x={labelX}
                y={y - 4}
                textAnchor="middle"
                fontSize="10"
                fill="oklch(0.42 0.06 55)"
                fontWeight="600"
              >
                {count}
              </text>
            )}
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              fontSize="9"
              fill="oklch(0.62 0.02 55)"
            >
              {weeks[i].label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Per-module accuracy horizontal bar chart ─────────────────────────────────

function ModuleAccuracyChart({ profileId }: { profileId: string }) {
  const moduleRows = QUIZ_MODULES.map((mod) => {
    const stats = getModuleStats(mod.id, profileId);
    return { mod, avg: stats.averageScore, sessions: stats.sessions.length };
  }).filter((r) => r.sessions > 0);

  if (moduleRows.length === 0) return null;

  const rowH = 32;
  const nameW = 110;
  const chartW = 400;
  const barAreaW = chartW - nameW - 52; // 52 for % label
  const padY = 4;
  const totalH = moduleRows.length * rowH + padY * 2;

  return (
    <svg
      viewBox={`0 0 ${chartW} ${totalH}`}
      width="100%"
      height={totalH}
      aria-label="Per-module accuracy chart"
      role="img"
    >
      {moduleRows.map((row, i) => {
        const y = padY + i * rowH;
        const barW = Math.max((row.avg / 100) * barAreaW, row.avg > 0 ? 4 : 0);
        const barY = y + rowH / 2 - 7;
        return (
          <g key={row.mod.id}>
            <text
              x={0}
              y={y + rowH / 2 + 4}
              fontSize="10"
              fill="oklch(0.45 0.03 55)"
              fontWeight="500"
            >
              {row.mod.name.length > 16
                ? `${row.mod.name.slice(0, 15)}\u2026`
                : row.mod.name}
            </text>
            <rect
              x={nameW}
              y={barY}
              width={barAreaW}
              height={14}
              rx={3}
              fill="oklch(0.93 0.02 55)"
            />
            {barW > 0 && (
              <rect
                x={nameW}
                y={barY}
                width={barW}
                height={14}
                rx={3}
                fill={row.mod.accent}
              />
            )}
            <text
              x={nameW + barAreaW + 6}
              y={y + rowH / 2 + 4}
              fontSize="10"
              fill="oklch(0.45 0.05 55)"
              fontWeight="600"
            >
              {row.avg}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Profile Chip ─────────────────────────────────────────────────────────────

function ProfileChip({
  name,
  isActive,
  isDefault,
  onClick,
  onDelete,
}: {
  name: string;
  isActive: boolean;
  isDefault: boolean;
  onClick: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px]"
        style={{
          backgroundColor: isActive
            ? "oklch(0.45 0.12 280)"
            : "oklch(0.93 0.02 55)",
          color: isActive ? "oklch(0.99 0.01 280)" : "oklch(0.40 0.04 55)",
          border: isActive
            ? "1px solid oklch(0.38 0.14 280)"
            : "1px solid oklch(0.85 0.03 55)",
          paddingRight: !isDefault ? "28px" : undefined,
        }}
      >
        {name}
      </button>
      {!isDefault && onDelete && (
        <button
          type="button"
          data-ocid="dashboard.profile.delete_button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors"
          aria-label={`Remove ${name}`}
          style={{
            backgroundColor: isActive
              ? "oklch(0.35 0.14 280)"
              : "oklch(0.85 0.03 55)",
            color: isActive ? "oklch(0.90 0.05 280)" : "oklch(0.55 0.03 55)",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardScreen({ onBack }: Props) {
  const {
    activeProfile,
    profiles,
    setActiveProfile,
    createProfile,
    deleteProfile,
  } = useLearner();

  const [pinState, setPinState] = useState<PinState>(() => {
    const locked = localStorage.getItem("numbuddy_dashboard_locked");
    const hasPin = !!localStorage.getItem(PIN_KEY);
    if (!hasPin) return "setting";
    if (locked === "true") return "locked";
    return "unlocked";
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showAddForm) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [showAddForm]);

  const handleUnlock = useCallback(() => {
    setPinState("unlocked");
    localStorage.removeItem("numbuddy_dashboard_locked");
  }, []);

  const handleLock = useCallback(() => {
    setPinState("locked");
    localStorage.setItem("numbuddy_dashboard_locked", "true");
  }, []);

  const handleAddProfile = useCallback(() => {
    const name = newName.trim();
    if (!name) {
      setNameError("Please enter a name.");
      return;
    }
    if (name.length > 20) {
      setNameError("Name must be 20 characters or fewer.");
      return;
    }
    const profile = createProfile(name);
    setActiveProfile(profile.id);
    setNewName("");
    setNameError("");
    setShowAddForm(false);
  }, [newName, createProfile, setActiveProfile]);

  const handleDeleteConfirm = useCallback(
    (id: string) => {
      deleteProfile(id);
      setDeleteConfirm(null);
      if (activeProfile.id === id) {
        setActiveProfile("default");
      }
    },
    [deleteProfile, activeProfile.id, setActiveProfile],
  );

  if (pinState === "locked" || pinState === "setting") {
    return <PinGate onUnlock={handleUnlock} />;
  }

  const profileId = activeProfile.id;
  const allStats = getAllStats(profileId);

  const totalSessions = Object.values(allStats).reduce(
    (sum, s) => sum + s.sessions.length,
    0,
  );
  const modulesStarted = Object.entries(allStats).filter(
    ([, s]) => s.sessions.length > 0,
  ).length;
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentSessions = Object.values(allStats).reduce(
    (sum, s) =>
      sum +
      s.sessions.filter((r) => new Date(r.date).getTime() > sevenDaysAgo)
        .length,
    0,
  );
  const hasAny = totalSessions > 0;

  const moduleData = QUIZ_MODULES.map((mod) => {
    const stats = getModuleStats(mod.id, profileId);
    const bestScore =
      stats.sessions.length > 0
        ? Math.max(
            ...stats.sessions.map((r) => Math.round((r.score / r.total) * 100)),
          )
        : null;
    const lastDifficulty =
      stats.sessions.length > 0 ? (stats.sessions[0].difficulty ?? null) : null;
    return { mod, stats, bestScore, lastDifficulty };
  });

  type ActivityRow = {
    modId: string;
    modName: string;
    dot: string;
    session: SessionRecord;
  };
  const allActivity: ActivityRow[] = [];
  for (const mod of QUIZ_MODULES) {
    const stats = getModuleStats(mod.id, profileId);
    for (const session of stats.sessions) {
      allActivity.push({
        modId: mod.id,
        modName: mod.name,
        dot: mod.dot,
        session,
      });
    }
  }
  allActivity.sort(
    (a, b) =>
      new Date(b.session.date).getTime() - new Date(a.session.date).getTime(),
  );
  const recentActivity = allActivity.slice(0, 10);
  const quizModuleCount = QUIZ_MODULES.length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Print styles */}
      <style>{`
        @media print {
          body { font-size: 12pt; background: white !important; color: black !important; }
          .print-hide { display: none !important; }
          .print-show { display: block !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        @media screen {
          .print-show { display: none !important; }
        }
      `}</style>

      {/* Print-only report header */}
      <div
        className="print-show"
        style={{
          padding: "0 0 24px 0",
          borderBottom: "2px solid #ccc",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontFamily: "Space Grotesk, system-ui, sans-serif",
            fontSize: "22pt",
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: "4px",
          }}
        >
          Studymore Progress Report — {activeProfile.name}
        </div>
        <div style={{ fontSize: "11pt", color: "#555", marginBottom: "2px" }}>
          {formatPrintDate()}
        </div>
        <div style={{ fontSize: "10pt", color: "#888" }}>
          Generated from the Parent &amp; Teacher Dashboard
        </div>
      </div>

      {/* Header */}
      <header className="print-hide px-4 pt-8 pb-4 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 flex-wrap mb-1">
          <button
            type="button"
            data-ocid="dashboard.back_button"
            onClick={onBack}
            className="text-sm px-3 py-2 rounded-md border transition-colors min-h-[44px]"
            style={{
              borderColor: "oklch(0.82 0.04 55)",
              color: "oklch(0.45 0.05 55)",
              backgroundColor: "transparent",
            }}
          >
            ← Back
          </button>
          <div className="flex-1">
            <h1
              className="text-2xl md:text-3xl font-medium tracking-tight"
              style={{
                fontFamily: "Space Grotesk, system-ui, sans-serif",
                color: "oklch(0.22 0.02 55)",
              }}
            >
              Parent &amp; Teacher View
            </h1>
            <p
              className="text-sm mt-0.5"
              style={{ color: "oklch(0.55 0.03 55)" }}
            >
              Track progress for each learner.
            </p>
          </div>
          <div className="flex gap-2">
            {hasAny && (
              <button
                type="button"
                data-ocid="dashboard.print_button"
                onClick={() => window.print()}
                className="text-sm px-3 py-2 rounded-md border transition-colors min-h-[44px]"
                style={{
                  borderColor: "oklch(0.72 0.10 55)",
                  color: "oklch(0.42 0.10 55)",
                  backgroundColor: "transparent",
                }}
              >
                Print report
              </button>
            )}
            <button
              type="button"
              data-ocid="dashboard.lock_button"
              onClick={handleLock}
              className="text-sm px-3 py-2 rounded-md border transition-colors min-h-[44px] flex items-center gap-1.5"
              style={{
                borderColor: "oklch(0.82 0.06 280)",
                color: "oklch(0.45 0.08 280)",
                backgroundColor: "transparent",
              }}
            >
              <svg
                width="13"
                height="14"
                viewBox="0 0 13 14"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="2"
                  y="6.5"
                  width="9"
                  height="7"
                  rx="1.5"
                  fill="oklch(0.70 0.10 280)"
                />
                <path
                  d="M4 6.5v-2a2.5 2.5 0 015 0v2"
                  stroke="oklch(0.45 0.10 280)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              Lock
            </button>
          </div>
        </div>
      </header>

      {/* Profile switcher */}
      <div className="print-hide px-4 pb-4 max-w-3xl mx-auto w-full">
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: "oklch(0.96 0.01 55)",
            border: "1px solid oklch(0.90 0.02 55)",
          }}
        >
          <div className="flex flex-wrap gap-2 items-center">
            {profiles.map((profile) => (
              <ProfileChip
                key={profile.id}
                name={profile.name}
                isActive={profile.id === activeProfile.id}
                isDefault={profile.id === "default"}
                onClick={() => setActiveProfile(profile.id)}
                onDelete={() => setDeleteConfirm(profile.id)}
              />
            ))}
            {!showAddForm && (
              <button
                type="button"
                data-ocid="dashboard.add_learner_button"
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-colors min-h-[44px]"
                style={{
                  backgroundColor: "transparent",
                  color: "oklch(0.45 0.08 280)",
                  border: "1.5px dashed oklch(0.68 0.10 280)",
                }}
              >
                + Add learner
              </button>
            )}
          </div>

          {showAddForm && (
            <div className="mt-3 flex items-start gap-2">
              <div className="flex-1">
                <input
                  ref={nameInputRef}
                  type="text"
                  data-ocid="dashboard.learner_name_input"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setNameError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddProfile();
                    if (e.key === "Escape") {
                      setShowAddForm(false);
                      setNewName("");
                    }
                  }}
                  maxLength={20}
                  placeholder="Learner name (e.g. Sam)"
                  className="w-full px-3 py-2.5 rounded-xl text-sm min-h-[44px]"
                  style={{
                    backgroundColor: "oklch(0.99 0.01 55)",
                    border: nameError
                      ? "1px solid oklch(0.60 0.18 25)"
                      : "1px solid oklch(0.85 0.03 55)",
                    color: "oklch(0.22 0.02 55)",
                    outline: "none",
                  }}
                />
                {nameError && (
                  <p
                    data-ocid="dashboard.learner_name_error"
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.50 0.18 25)" }}
                  >
                    {nameError}
                  </p>
                )}
              </div>
              <button
                type="button"
                data-ocid="dashboard.add_learner_submit_button"
                onClick={handleAddProfile}
                className="px-4 py-2.5 rounded-xl text-sm font-medium min-h-[44px]"
                style={{
                  backgroundColor: "oklch(0.45 0.12 280)",
                  color: "oklch(0.99 0.01 280)",
                }}
              >
                Add
              </button>
              <button
                type="button"
                data-ocid="dashboard.add_learner_cancel_button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewName("");
                  setNameError("");
                }}
                className="px-4 py-2.5 rounded-xl text-sm min-h-[44px]"
                style={{
                  backgroundColor: "oklch(0.90 0.02 55)",
                  color: "oklch(0.45 0.03 55)",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div
          className="print-hide fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "oklch(0.10 0.02 55 / 0.4)" }}
          data-ocid="dashboard.delete_profile.dialog"
        >
          <div
            className="w-full max-w-sm rounded-2xl p-7"
            style={{
              backgroundColor: "oklch(0.99 0.01 55)",
              border: "1px solid oklch(0.85 0.05 25)",
            }}
          >
            <h2
              className="text-lg font-medium mb-2"
              style={{
                fontFamily: "Space Grotesk, system-ui, sans-serif",
                color: "oklch(0.22 0.02 55)",
              }}
            >
              Remove {profiles.find((p) => p.id === deleteConfirm)?.name}?
            </h2>
            <p
              className="text-sm mb-5"
              style={{ color: "oklch(0.50 0.03 55)" }}
            >
              Their progress will be permanently deleted.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="dashboard.delete_profile.confirm_button"
                onClick={() => handleDeleteConfirm(deleteConfirm)}
                className="flex-1 py-3 rounded-xl text-sm font-medium min-h-[48px]"
                style={{
                  backgroundColor: "oklch(0.50 0.18 25)",
                  color: "oklch(0.98 0.01 25)",
                }}
              >
                Remove
              </button>
              <button
                type="button"
                data-ocid="dashboard.delete_profile.cancel_button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl text-sm min-h-[48px]"
                style={{
                  backgroundColor: "oklch(0.93 0.02 55)",
                  color: "oklch(0.45 0.03 55)",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-12">
        {!hasAny && (
          <div
            data-ocid="dashboard.empty_state"
            className="mt-4 text-center px-6 py-12 rounded-xl border"
            style={{
              borderColor: "oklch(0.88 0.03 55)",
              backgroundColor: "oklch(0.97 0.01 55)",
            }}
          >
            <p
              className="text-base md:text-lg font-medium mb-2"
              style={{ color: "oklch(0.35 0.03 55)" }}
            >
              No sessions yet for {activeProfile.name}.
            </p>
            <p className="text-sm" style={{ color: "oklch(0.58 0.02 55)" }}>
              Once this learner completes a module, their progress will appear
              here.
            </p>
          </div>
        )}

        {hasAny && (
          <>
            {/* Sessions per week chart */}
            <section
              className="rounded-xl border p-5 md:p-6 mb-5"
              style={{
                borderColor: "oklch(0.88 0.03 55)",
                backgroundColor: "oklch(0.99 0.01 55)",
              }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "oklch(0.58 0.05 55)" }}
              >
                Sessions per Week
              </h2>
              <SessionsBarChart profileId={profileId} />
            </section>

            {/* Per-module accuracy chart */}
            {QUIZ_MODULES.some(
              (m) => getModuleStats(m.id, profileId).sessions.length > 0,
            ) && (
              <section
                className="rounded-xl border p-5 md:p-6 mb-5"
                style={{
                  borderColor: "oklch(0.88 0.03 55)",
                  backgroundColor: "oklch(0.99 0.01 55)",
                }}
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "oklch(0.58 0.05 55)" }}
                >
                  Accuracy by Module
                </h2>
                <ModuleAccuracyChart profileId={profileId} />
              </section>
            )}

            {/* Overall Summary */}
            <section
              data-ocid="dashboard.summary_card"
              className="rounded-xl border p-5 md:p-6 mb-5"
              style={{
                borderColor: "oklch(0.88 0.03 55)",
                backgroundColor: "oklch(0.97 0.01 55)",
              }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "oklch(0.58 0.05 55)" }}
              >
                Overall Summary
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: totalSessions, label: "Sessions completed" },
                  {
                    value: `${modulesStarted}/${quizModuleCount}`,
                    label: "Modules started",
                  },
                  { value: recentSessions, label: "Last 7 days" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-lg p-4 text-center"
                    style={{ backgroundColor: "oklch(0.93 0.04 55)" }}
                  >
                    <div
                      className="text-3xl md:text-4xl font-medium tabular-nums mb-1"
                      style={{
                        fontFamily: "Space Grotesk, system-ui, sans-serif",
                        color: "oklch(0.35 0.08 55)",
                      }}
                    >
                      {value}
                    </div>
                    <div
                      className="text-xs leading-tight"
                      style={{ color: "oklch(0.52 0.05 55)" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Per-module breakdown */}
            <section className="mb-5">
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "oklch(0.58 0.05 55)" }}
              >
                Module Breakdown
              </h2>
              <div className="flex flex-col gap-3">
                {moduleData.map(
                  ({ mod, stats, bestScore, lastDifficulty }, i) => (
                    <div
                      key={mod.id}
                      data-ocid={`dashboard.module.item.${i + 1}`}
                      className="rounded-xl border p-4 md:p-5"
                      style={{
                        borderColor:
                          stats.sessions.length > 0
                            ? mod.border
                            : "oklch(0.90 0.02 55)",
                        backgroundColor:
                          stats.sessions.length > 0
                            ? mod.bg
                            : "oklch(0.98 0.01 55)",
                      }}
                    >
                      {stats.sessions.length === 0 ? (
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm font-medium"
                            style={{ color: "oklch(0.65 0.02 55)" }}
                          >
                            {mod.name}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "oklch(0.70 0.02 55)" }}
                          >
                            Not started yet
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3
                                className="text-sm md:text-base font-semibold mb-0.5"
                                style={{ color: mod.accent }}
                              >
                                {mod.name}
                              </h3>
                              <p
                                className="text-xs"
                                style={{ color: "oklch(0.55 0.03 55)" }}
                              >
                                {stats.sessions.length} session
                                {stats.sessions.length !== 1 ? "s" : ""}
                                {lastDifficulty
                                  ? ` · Last: ${capitalize(lastDifficulty)}`
                                  : ""}
                                {" · "}
                                {timeAgo(stats.lastPlayed!)}
                              </p>
                            </div>
                            <div className="flex gap-3 flex-shrink-0 tabular-nums">
                              <div className="text-center">
                                <div
                                  className="text-lg md:text-xl font-medium"
                                  style={{ color: mod.accent }}
                                >
                                  {stats.averageScore}%
                                </div>
                                <div
                                  className="text-xs"
                                  style={{ color: "oklch(0.60 0.02 55)" }}
                                >
                                  avg
                                </div>
                              </div>
                              {bestScore !== null && (
                                <div className="text-center">
                                  <div
                                    className="text-lg md:text-xl font-medium"
                                    style={{ color: mod.accent }}
                                  >
                                    {bestScore}%
                                  </div>
                                  <div
                                    className="text-xs"
                                    style={{ color: "oklch(0.60 0.02 55)" }}
                                  >
                                    best
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            className="h-1.5 rounded-full overflow-hidden"
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
                        </>
                      )}
                    </div>
                  ),
                )}
              </div>
            </section>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <section data-ocid="dashboard.activity_section">
                <h2
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "oklch(0.58 0.05 55)" }}
                >
                  Recent Activity
                </h2>
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{
                    borderColor: "oklch(0.88 0.03 55)",
                    backgroundColor: "oklch(0.97 0.01 55)",
                  }}
                >
                  {recentActivity.map((row, i) => (
                    <div
                      key={`${row.modId}-${row.session.date}`}
                      data-ocid={`dashboard.activity.item.${i + 1}`}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{
                        borderBottom:
                          i < recentActivity.length - 1
                            ? "1px solid oklch(0.90 0.02 55)"
                            : "none",
                      }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: row.dot }}
                      />
                      <span
                        className="flex-1 text-sm truncate"
                        style={{ color: "oklch(0.30 0.03 55)" }}
                      >
                        {row.modName}
                      </span>
                      <span
                        className="text-sm tabular-nums font-medium"
                        style={{ color: "oklch(0.35 0.04 55)" }}
                      >
                        {row.session.score}/{row.session.total}
                      </span>
                      {row.session.difficulty && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: "oklch(0.90 0.03 55)",
                            color: "oklch(0.50 0.04 55)",
                          }}
                        >
                          {capitalize(row.session.difficulty)}
                        </span>
                      )}
                      <span
                        className="text-xs flex-shrink-0"
                        style={{ color: "oklch(0.62 0.02 55)" }}
                      >
                        {timeAgo(row.session.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
