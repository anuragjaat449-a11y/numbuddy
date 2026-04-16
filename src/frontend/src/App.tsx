import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useRef, useState } from "react";
import { createActor } from "./backend";
import ErrorBoundary from "./components/ErrorBoundary";
import { LearnerProvider, useLearner } from "./context/LearnerContext";
import { SoundProvider } from "./context/SoundContext";
import type { QuestionData } from "./game/questions";
import { generateQuestion } from "./game/questions";
import AnxietyCheckIn from "./screens/AnxietyCheckIn";
import AssessmentScreen from "./screens/AssessmentScreen";
import CalmScreen from "./screens/CalmScreen";
import DashboardScreen from "./screens/DashboardScreen";
import DifficultyScreen from "./screens/DifficultyScreen";
import GameScreen from "./screens/GameScreen";
import HomeScreen from "./screens/HomeScreen";
import LandingScreen from "./screens/LandingScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import ProgressScreen from "./screens/ProgressScreen";
import ResultScreen from "./screens/ResultScreen";
import {
  bulkImportToBackend,
  getAllProgressData,
  saveSession,
  saveSessionToBackend,
  syncProgressFromBackend,
} from "./utils/progress";

export type CatId =
  | "number"
  | "arith"
  | "money"
  | "time"
  | "sequence"
  | "calm"
  | "numberline"
  | "estimation"
  | "stepseq"
  | "fractions"
  | "measurement";

export type Difficulty = "easy" | "medium" | "hard";

export type Screen =
  | "landing"
  | "home"
  | "onboarding"
  | "checkin"
  | "difficulty"
  | "game"
  | "result"
  | "calm"
  | "progress"
  | "assessment"
  | "dashboard";

export interface GameState {
  catId: CatId;
  difficulty: Difficulty;
  round: number;
  score: number;
  answered: boolean;
  totalRounds: number;
  q: QuestionData;
}

function MigrationModal({
  onYes,
  onNo,
}: {
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "oklch(0 0 0 / 0.65)" }}
      data-ocid="migration.modal"
    >
      <div
        className="w-full max-w-sm rounded-2xl p-7 shadow-lg"
        style={{
          backgroundColor: "oklch(0.18 0.015 260)",
          border: "1px solid oklch(0.30 0.015 260)",
        }}
      >
        <h2
          className="text-xl font-medium mb-3"
          style={{
            fontFamily: "Space Grotesk, system-ui, sans-serif",
            color: "oklch(0.93 0.01 260)",
          }}
        >
          Save your progress?
        </h2>
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "oklch(0.58 0.01 260)" }}
        >
          You have practice sessions saved on this device. Would you like to
          save them to your account so they&apos;re available on all your
          devices?
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            data-ocid="migration.confirm_button"
            onClick={onYes}
            className="w-full py-3 rounded-xl text-sm font-medium transition-colors min-h-[48px]"
            style={{
              backgroundColor: "oklch(0.72 0.18 190)",
              color: "oklch(0.12 0.01 190)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.65 0.20 190)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.72 0.18 190)";
            }}
          >
            Yes, save it to my account
          </button>
          <button
            type="button"
            data-ocid="migration.cancel_button"
            onClick={onNo}
            className="w-full py-3 rounded-xl text-sm transition-colors min-h-[48px]"
            style={{
              backgroundColor: "oklch(0.22 0.015 260)",
              color: "oklch(0.55 0.01 260)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.26 0.015 260)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.22 0.015 260)";
            }}
          >
            Keep it on this device
          </button>
        </div>
      </div>
    </div>
  );
}

function SyncingBanner() {
  return (
    <output
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-2.5 rounded-full shadow-md text-sm"
      style={{
        backgroundColor: "oklch(0.18 0.015 260)",
        border: "1px solid oklch(0.30 0.015 260)",
        color: "oklch(0.65 0.01 260)",
      }}
      aria-live="polite"
      data-ocid="sync.loading_state"
    >
      {/* Spinning ring */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="animate-spin"
        aria-hidden="true"
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="oklch(0.72 0.18 190)"
          strokeWidth="2"
          strokeDasharray="28"
          strokeDashoffset="10"
          strokeLinecap="round"
        />
      </svg>
      Syncing your progress…
    </output>
  );
}

function SaveFailedToast() {
  return (
    <output
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-2.5 rounded-full shadow-md text-sm"
      style={{
        backgroundColor: "oklch(0.22 0.05 30)",
        border: "1px solid oklch(0.40 0.12 30)",
        color: "oklch(0.80 0.06 30)",
      }}
      aria-live="assertive"
      data-ocid="save_failed.toast"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="6" fill="oklch(0.55 0.18 25)" />
        <path
          d="M8 5v3.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="8" cy="10.5" r="0.75" fill="white" />
      </svg>
      Session saved locally. Your account couldn’t be reached.
    </output>
  );
}

function AppContent() {
  const { activeProfile, syncProfilesFromBackend } = useLearner();
  const [screen, setScreen] = useState<Screen>("landing");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [pendingCatId, setPendingCatId] = useState<Exclude<
    CatId,
    "calm"
  > | null>(null);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [pendingMigrationCheck, setPendingMigrationCheck] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSaveFailed, setShowSaveFailed] = useState(false);

  const { identity } = useInternetIdentity();
  const { actor: rawActor } = useActor(createActor);
  // Cast to the session/profile actor interfaces expected by progress utils
  const actor = rawActor as
    | (import("./utils/progress").SessionActor &
        import("./utils/progress").ProfileActor)
    | null;

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  const prevPrincipalRef = useRef<string | undefined>(undefined);

  // Detect login transition
  useEffect(() => {
    const isAnon = !identity || identity.getPrincipal().isAnonymous();
    const principal = isAnon ? undefined : identity.getPrincipal().toString();
    const wasLoggedIn = !!prevPrincipalRef.current;
    const isLoggedIn = !!principal;
    prevPrincipalRef.current = principal;

    if (!wasLoggedIn && isLoggedIn) {
      setPendingMigrationCheck(true);
    }
  }, [identity]);

  // Once actor is ready and migration check is pending, run it
  useEffect(() => {
    if (!pendingMigrationCheck || !actor) return;
    setPendingMigrationCheck(false);

    const migrated = localStorage.getItem("numbuddy_migrated");
    const data = getAllProgressData();
    const hasData = Object.values(data).some((arr) => arr.length > 0);

    if (!migrated && hasData) {
      setShowMigrationModal(true);
    } else {
      setIsSyncing(true);
      Promise.all([
        syncProgressFromBackend(actor),
        syncProfilesFromBackend(actor),
      ])
        .catch(() => {})
        .finally(() => setIsSyncing(false));
    }
  }, [pendingMigrationCheck, actor, syncProfilesFromBackend]);

  const handleMigrationYes = useCallback(async () => {
    setShowMigrationModal(false);
    localStorage.setItem("numbuddy_migrated", "true");
    if (actor) {
      setIsSyncing(true);
      try {
        await bulkImportToBackend(actor);
        await Promise.all([
          syncProgressFromBackend(actor),
          syncProfilesFromBackend(actor),
        ]);
      } catch {
        // Silent failure — progress is still in localStorage
      } finally {
        setIsSyncing(false);
      }
    }
  }, [actor, syncProfilesFromBackend]);

  const handleMigrationNo = useCallback(() => {
    setShowMigrationModal(false);
    localStorage.setItem("numbuddy_migrated", "true");
    if (actor) {
      setIsSyncing(true);
      Promise.all([
        syncProgressFromBackend(actor),
        syncProfilesFromBackend(actor),
      ])
        .catch(() => {})
        .finally(() => setIsSyncing(false));
    }
  }, [actor, syncProfilesFromBackend]);

  const handleEnterFromLanding = useCallback(() => {
    const onboarded = localStorage.getItem("numbuddy_onboarded");
    if (!onboarded) {
      setScreen("onboarding");
    } else {
      setScreen("home");
    }
  }, []);

  const handleOnboardingDone = useCallback(() => {
    localStorage.setItem("numbuddy_onboarded", "true");
    setScreen("home");
  }, []);

  const startGame = useCallback(
    (catId: Exclude<CatId, "calm">, difficulty: Difficulty) => {
      const q = generateQuestion(catId, difficulty);
      setGameState({
        catId,
        difficulty,
        round: 1,
        score: 0,
        answered: false,
        totalRounds: 5,
        q,
      });
      setScreen("game");
    },
    [],
  );

  const startModule = useCallback((catId: CatId) => {
    if (catId === "calm") {
      setScreen("calm");
      return;
    }
    setPendingCatId(catId);
    setScreen("checkin");
  }, []);

  const handleAnswer = useCallback((correct: boolean) => {
    if (!gameStateRef.current) return;
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        answered: true,
        score: correct ? prev.score + 1 : prev.score,
      };
    });
  }, []);

  const handleResult = useCallback(() => {
    const gs = gameStateRef.current;
    if (gs) {
      const date = new Date().toISOString();
      saveSession(
        gs.catId,
        gs.score,
        gs.totalRounds,
        gs.difficulty,
        date,
        activeProfile.id,
      );
      if (actor) {
        saveSessionToBackend(
          actor,
          gs.catId,
          gs.score,
          gs.totalRounds,
          gs.difficulty,
          date,
          activeProfile.id,
        ).then((success) => {
          if (!success) {
            setShowSaveFailed(true);
            setTimeout(() => setShowSaveFailed(false), 5000);
          }
        });
      }
    }
    setScreen("result");
  }, [actor, activeProfile.id]);

  const advanceRound = useCallback(() => {
    const gs = gameStateRef.current;
    if (!gs) return;
    if (gs.round >= gs.totalRounds) {
      handleResult();
    } else {
      const nextQ = generateQuestion(
        gs.catId as Exclude<CatId, "calm">,
        gs.difficulty,
      );
      setGameState((prev) =>
        prev
          ? { ...prev, round: prev.round + 1, answered: false, q: nextQ }
          : prev,
      );
    }
  }, [handleResult]);

  const tryAgain = useCallback(() => {
    const gs = gameStateRef.current;
    if (!gs) return;
    startGame(gs.catId as Exclude<CatId, "calm">, gs.difficulty);
  }, [startGame]);

  const goHome = useCallback(() => {
    setScreen("home");
    setGameState(null);
    setPendingCatId(null);
  }, []);

  const goProgress = useCallback(() => setScreen("progress"), []);
  const goAssessment = useCallback(() => setScreen("assessment"), []);
  const goDashboard = useCallback(() => setScreen("dashboard"), []);

  const getAssessmentSuggestion = (catId: Exclude<CatId, "calm">) => {
    try {
      const raw = localStorage.getItem("numbuddy_assessment");
      if (!raw) return null;
      const data = JSON.parse(raw) as { responses: boolean[] };
      const responses = data.responses;
      if (!responses || responses.length < 12) return null;

      const areaIndices: Record<string, number[]> = {
        number: [0, 1, 11, 2, 3, 4, 8],
        numberline: [0, 1, 11, 2, 3, 4, 8],
        arith: [5, 6, 7],
        sequence: [5, 6, 7],
        stepseq: [5, 6, 7],
        fractions: [0, 1, 5, 6, 7],
        measurement: [0, 1, 2, 3, 9, 10],
        time: [9, 10],
        estimation: [9, 10],
        money: [2, 3, 4, 8],
      };

      const indices = areaIndices[catId];
      if (!indices) return null;

      const validIndices = indices.filter((i) => i < responses.length);
      if (validIndices.length === 0) return null;

      const correct = validIndices.filter((i) => responses[i]).length;
      const pct = correct / validIndices.length;

      if (pct < 0.34)
        return {
          difficulty: "easy" as const,
          reason:
            "Based on your assessment, Easy might be a good starting point.",
        };
      if (pct < 0.67)
        return {
          difficulty: "medium" as const,
          reason: "Based on your assessment, Medium looks like a good fit.",
        };
      return {
        difficulty: "hard" as const,
        reason: "Your assessment shows you're ready to try Hard.",
      };
    } catch {
      return null;
    }
  };

  const handleAssessmentStartModule = useCallback(
    (catId: CatId) => {
      setScreen("home");
      startModule(catId);
    },
    [startModule],
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "oklch(0.11 0.01 260)" }}
    >
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      {isSyncing && <SyncingBanner />}
      {showSaveFailed && <SaveFailedToast />}
      {showMigrationModal && (
        <MigrationModal onYes={handleMigrationYes} onNo={handleMigrationNo} />
      )}
      {screen === "landing" && (
        <LandingScreen
          onEnter={handleEnterFromLanding}
          onAssessment={goAssessment}
        />
      )}
      {screen === "onboarding" && (
        <OnboardingScreen
          onDone={handleOnboardingDone}
          onBack={() => setScreen("landing")}
        />
      )}
      {screen === "home" && (
        <HomeScreen
          onStart={startModule}
          onProgress={goProgress}
          onAssessment={goAssessment}
          onDashboard={goDashboard}
        />
      )}
      {screen === "checkin" && pendingCatId && (
        <AnxietyCheckIn
          catId={pendingCatId}
          onConfirm={() => setScreen("difficulty")}
          onBack={() => setScreen("home")}
          onCalm={() => setScreen("calm")}
        />
      )}
      {screen === "difficulty" &&
        pendingCatId &&
        (() => {
          const suggestion = getAssessmentSuggestion(pendingCatId);
          return (
            <DifficultyScreen
              catId={pendingCatId}
              onSelect={(difficulty) => startGame(pendingCatId, difficulty)}
              onBack={() => setScreen("checkin")}
              suggestedDifficulty={suggestion?.difficulty}
              suggestionReason={suggestion?.reason}
            />
          );
        })()}
      {screen === "game" && gameState && (
        <GameScreen
          state={gameState}
          onAnswer={handleAnswer}
          onAdvance={advanceRound}
          onBack={goHome}
          onResult={handleResult}
        />
      )}
      {screen === "result" && gameState && (
        <ResultScreen state={gameState} onTryAgain={tryAgain} onHome={goHome} />
      )}
      {screen === "calm" && <CalmScreen onBack={goHome} />}
      {screen === "progress" && (
        <ProgressScreen onBack={goHome} actor={actor ?? undefined} />
      )}
      {screen === "assessment" && (
        <AssessmentScreen
          onHome={goHome}
          onStartModule={handleAssessmentStartModule}
        />
      )}
      {screen === "dashboard" && <DashboardScreen onBack={goHome} />}
      {screen !== "landing" && (
        <footer
          style={{
            padding: "0.875rem 1rem",
            textAlign: "center",
            fontSize: "0.75rem",
            color: "oklch(0.38 0.01 260)",
            borderTop: "1px solid oklch(0.20 0.015 260)",
            backgroundColor: "oklch(0.14 0.015 260)",
          }}
        >
          Made with ❤️ by{" "}
          <a
            href="https://www.instagram.com/anurag_singh.indoliya?igsh=MWFjcmJoYzZmN3Iwbw=="
            target="_blank"
            rel="noreferrer"
            style={{
              color: "oklch(0.72 0.18 190)",
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
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SoundProvider>
        <LearnerProvider>
          <AppContent />
        </LearnerProvider>
      </SoundProvider>
    </ErrorBoundary>
  );
}
