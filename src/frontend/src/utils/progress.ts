import { getProgressKey } from "./learnerProfiles";
import type { LearnerProfile } from "./learnerProfiles";

export interface SessionRecord {
  score: number;
  total: number;
  date: string; // ISO string
  difficulty?: string;
}

export interface ModuleStats {
  sessions: SessionRecord[];
  averageScore: number;
  lastPlayed: string | null;
}

const DEFAULT_STORAGE_KEY = "brainwarmup_progress";
const MAX_SESSIONS = 10;

type ProgressData = Record<string, SessionRecord[]>;

// Backend actor interface matching backend.d.ts
interface BackendSession {
  categoryId: string;
  total: bigint;
  date: string;
  difficulty: string;
  score: bigint;
  learnerId: string;
}

interface BackendCatSessions {
  categoryId: string;
  learnerId: string;
  sessions: Array<BackendSession>;
}

interface BackendLearnerProfileDTO {
  id: string;
  name: string;
  createdAt: string;
}

export interface SessionActor {
  getSessionsByUser(): Promise<Array<BackendCatSessions>>;
  bulkImportSessions(catSessions: Array<BackendCatSessions>): Promise<void>;
  saveSession(session: BackendSession): Promise<void>;
}

export interface ProfileActor {
  getLearnerProfiles(): Promise<Array<BackendLearnerProfileDTO>>;
  saveLearnerProfile(profile: BackendLearnerProfileDTO): Promise<void>;
  deleteLearnerProfile(id: string): Promise<void>;
}

// Combined actor used in most places
export type ProgressActor = SessionActor & ProfileActor;

function storageKey(profileId?: string): string {
  if (!profileId || profileId === "default") return DEFAULT_STORAGE_KEY;
  return getProgressKey(profileId);
}

function load(profileId?: string): ProgressData {
  try {
    return JSON.parse(localStorage.getItem(storageKey(profileId)) ?? "{}");
  } catch {
    return {};
  }
}

function save(data: ProgressData, profileId?: string) {
  localStorage.setItem(storageKey(profileId), JSON.stringify(data));
}

export function saveSession(
  catId: string,
  score: number,
  total: number,
  difficulty?: string,
  date?: string,
  profileId?: string,
) {
  const data = load(profileId);
  const sessions = data[catId] ?? [];
  sessions.unshift({
    score,
    total,
    date: date ?? new Date().toISOString(),
    difficulty,
  });
  data[catId] = sessions.slice(0, MAX_SESSIONS);
  save(data, profileId);
}

export function getModuleStats(catId: string, profileId?: string): ModuleStats {
  const data = load(profileId);
  const sessions = data[catId] ?? [];
  const avg = sessions.length
    ? Math.round(
        (sessions.reduce((s, r) => s + r.score / r.total, 0) /
          sessions.length) *
          100,
      )
    : 0;
  return {
    sessions,
    averageScore: avg,
    lastPlayed: sessions[0]?.date ?? null,
  };
}

export function getAllStats(profileId?: string): Record<string, ModuleStats> {
  const data = load(profileId);
  const result: Record<string, ModuleStats> = {};
  for (const catId of Object.keys(data)) {
    result[catId] = getModuleStats(catId, profileId);
  }
  return result;
}

/** Returns the raw progress data from localStorage (for migration). */
export function getAllProgressData(profileId?: string): ProgressData {
  return load(profileId);
}

/** Merge sessions from the backend into localStorage. Backend wins on matching dates. */
export function mergeFromBackend(
  catSessions: Array<BackendCatSessions>,
  profileId?: string,
) {
  const local = load(profileId);
  for (const cat of catSessions) {
    const backendSessions: SessionRecord[] = cat.sessions.map((s) => ({
      score: Number(s.score),
      total: Number(s.total),
      date: s.date,
      difficulty: s.difficulty,
    }));
    const backendDates = new Set(backendSessions.map((s) => s.date));
    const localSessions = local[cat.categoryId] ?? [];
    const localOnly = localSessions.filter((s) => !backendDates.has(s.date));
    const merged = [...backendSessions, ...localOnly];
    merged.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    local[cat.categoryId] = merged.slice(0, MAX_SESSIONS);
  }
  save(local, profileId);
}

/** Fetch all sessions from backend and merge into localStorage. */
export async function syncProgressFromBackend(
  actor: SessionActor,
  profileId?: string,
): Promise<void> {
  const catSessions = await actor.getSessionsByUser();
  mergeFromBackend(catSessions, profileId);
}

/** Save a session to the backend (in addition to localStorage). Retries up to 3 times. Returns true on success. */
export async function saveSessionToBackend(
  actor: SessionActor,
  catId: string,
  score: number,
  total: number,
  difficulty: string,
  date: string,
  learnerId = "default",
): Promise<boolean> {
  const session = {
    categoryId: catId,
    score: BigInt(score),
    total: BigInt(total),
    difficulty,
    date,
    learnerId,
  };
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await actor.saveSession(session);
      return true;
    } catch {
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  return false;
}

/** Bulk import all localStorage sessions to backend (migration). */
export async function bulkImportToBackend(
  actor: SessionActor,
  profileId?: string,
  learnerId = "default",
): Promise<void> {
  const data = load(profileId);
  const catSessions: BackendCatSessions[] = Object.entries(data).map(
    ([categoryId, sessions]) => ({
      categoryId,
      learnerId,
      sessions: sessions.map((s) => ({
        categoryId,
        score: BigInt(s.score),
        total: BigInt(s.total),
        date: s.date,
        difficulty: s.difficulty ?? "easy",
        learnerId,
      })),
    }),
  );
  if (catSessions.length > 0) {
    await actor.bulkImportSessions(catSessions);
  }
}

// ─── Learner Profile Backend Sync ────────────────────────────────────────────

/**
 * Fetch learner profiles from backend.
 * Returns the list, or null if the call fails.
 */
export async function getLearnerProfilesFromBackend(
  actor: ProfileActor,
): Promise<LearnerProfile[] | null> {
  try {
    const profiles = await actor.getLearnerProfiles();
    return profiles.map((p) => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
    }));
  } catch {
    return null;
  }
}

/** Save a single learner profile to the backend. */
export async function saveLearnerProfileToBackend(
  actor: ProfileActor,
  profile: LearnerProfile,
): Promise<void> {
  try {
    await actor.saveLearnerProfile({
      id: profile.id,
      name: profile.name,
      createdAt: profile.createdAt,
    });
  } catch {
    // Silent failure — profile still exists locally
  }
}

/** Delete a learner profile from the backend. */
export async function deleteLearnerProfileFromBackend(
  actor: ProfileActor,
  id: string,
): Promise<void> {
  try {
    await actor.deleteLearnerProfile(id);
  } catch {
    // Silent failure
  }
}

// ─── Analytics Utilities ─────────────────────────────────────────────────────

/**
 * Returns the number of consecutive days the user has had at least one session.
 * Counts back from today (or yesterday if today has no sessions).
 */
export function getStreak(profileId?: string): number {
  const data = load(profileId);
  const allSessions = Object.values(data).flat();
  if (allSessions.length === 0) return 0;

  const dateSet = new Set<string>();
  for (const s of allSessions) {
    const d = s.date.slice(0, 10); // YYYY-MM-DD
    dateSet.add(d);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = today.toISOString().slice(0, 10);
  const yesterdayStr = new Date(today.getTime() - 86400000)
    .toISOString()
    .slice(0, 10);

  // Start from today if it has sessions, otherwise yesterday
  let cursor: Date;
  if (dateSet.has(todayStr)) {
    cursor = new Date(today);
  } else if (dateSet.has(yesterdayStr)) {
    cursor = new Date(today.getTime() - 86400000);
  } else {
    return 0;
  }

  let streak = 0;
  while (true) {
    const dateStr = cursor.toISOString().slice(0, 10);
    if (!dateSet.has(dateStr)) break;
    streak++;
    cursor = new Date(cursor.getTime() - 86400000);
  }
  return streak;
}

/**
 * Returns whether a module's accuracy is trending up, down, or stable.
 * Compares newest 3 sessions vs previous 3.
 */
export function getModuleTrend(
  catId: string,
  profileId?: string,
): "up" | "down" | "stable" {
  const data = load(profileId);
  const sessions = data[catId] ?? [];
  if (sessions.length < 4) return "stable";

  const avg = (slice: SessionRecord[]) =>
    slice.reduce((sum, s) => sum + (s.score / s.total) * 100, 0) / slice.length;

  const newer = avg(sessions.slice(0, 3));
  const older = avg(sessions.slice(3, 6));
  const diff = newer - older;

  if (diff > 5) return "up";
  if (diff < -5) return "down";
  return "stable";
}

/**
 * Returns the catId of the module with the lowest average accuracy (last 3 sessions).
 * Returns null if fewer than 3 total sessions across all modules.
 */
export function getSuggestedModule(profileId?: string): string | null {
  const data = load(profileId);
  const totalSessions = Object.values(data).reduce(
    (sum, s) => sum + s.length,
    0,
  );
  if (totalSessions < 3) return null;

  let lowestCatId: string | null = null;
  let lowestAvg = Number.POSITIVE_INFINITY;

  for (const [catId, sessions] of Object.entries(data)) {
    if (sessions.length < 2) continue;
    const last3 = sessions.slice(0, 3);
    const avg =
      last3.reduce((sum, s) => sum + (s.score / s.total) * 100, 0) /
      last3.length;
    if (avg < lowestAvg) {
      lowestAvg = avg;
      lowestCatId = catId;
    }
  }

  return lowestCatId;
}

/**
 * Returns last 5 session accuracy values in chronological order (oldest first).
 */
export function getSparklineData(catId: string, profileId?: string): number[] {
  const data = load(profileId);
  const sessions = (data[catId] ?? []).slice(0, 5);
  // sessions[0] is newest — reverse for chronological order
  return sessions
    .slice()
    .reverse()
    .map((s) => Math.round((s.score / s.total) * 100));
}
