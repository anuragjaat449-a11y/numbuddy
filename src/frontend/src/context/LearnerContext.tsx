import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_PROFILE,
  type LearnerProfile,
  createProfile as createProfileUtil,
  deleteProfile as deleteProfileUtil,
  getActiveProfileId,
  getProfiles,
  saveProfiles,
  setActiveProfileId,
} from "../utils/learnerProfiles";
import type { ProfileActor } from "../utils/progress";
import {
  deleteLearnerProfileFromBackend,
  getLearnerProfilesFromBackend,
  saveLearnerProfileToBackend,
} from "../utils/progress";

interface LearnerContextType {
  activeProfile: LearnerProfile;
  profiles: LearnerProfile[];
  setActiveProfile: (id: string) => void;
  createProfile: (name: string) => LearnerProfile;
  deleteProfile: (id: string) => void;
  /** Call after login to sync backend profiles into local state. */
  syncProfilesFromBackend: (actor: ProfileActor) => Promise<void>;
}

const LearnerContext = createContext<LearnerContextType | null>(null);

export function LearnerProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfilesState] = useState<LearnerProfile[]>(() =>
    getProfiles(),
  );
  const [activeProfileId, setActiveProfileIdState] = useState<string>(() =>
    getActiveProfileId(),
  );

  // Keep a ref to the latest actor so callbacks can use it without stale closures
  const actorRef = useRef<ProfileActor | null>(null);

  // Ensure active profile exists in list
  useEffect(() => {
    if (!profiles.some((p) => p.id === activeProfileId)) {
      setActiveProfileIdState("default");
      setActiveProfileId("default");
    }
  }, [profiles, activeProfileId]);

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) ?? DEFAULT_PROFILE;

  const setActiveProfile = useCallback((id: string) => {
    setActiveProfileId(id);
    setActiveProfileIdState(id);
  }, []);

  const createProfile = useCallback((name: string): LearnerProfile => {
    const profile = createProfileUtil(name);
    const updated = getProfiles();
    setProfilesState(updated);
    // Sync to backend if actor is available
    if (actorRef.current) {
      saveLearnerProfileToBackend(actorRef.current, profile).catch(() => {});
    }
    return profile;
  }, []);

  const deleteProfile = useCallback((id: string) => {
    deleteProfileUtil(id);
    const updated = getProfiles();
    setProfilesState(updated);
    // Sync to backend if actor is available
    if (actorRef.current) {
      deleteLearnerProfileFromBackend(actorRef.current, id).catch(() => {});
    }
  }, []);

  /**
   * Sync learner profiles from backend.
   * - If backend has profiles, merge them into localStorage (backend wins).
   * - If backend is empty, migrate local profiles to backend.
   */
  const syncProfilesFromBackend = useCallback(async (actor: ProfileActor) => {
    actorRef.current = actor;
    const backendProfiles = await getLearnerProfilesFromBackend(actor);
    if (backendProfiles === null) return; // network failure, keep local

    if (backendProfiles.length === 0) {
      // No backend profiles yet — migrate local ones (excluding default)
      const localProfiles = getProfiles();
      const toMigrate = localProfiles.filter((p) => p.id !== "default");
      for (const p of toMigrate) {
        await saveLearnerProfileToBackend(actor, p).catch(() => {});
      }
    } else {
      // Backend has profiles — merge: add backend profiles missing locally
      const localProfiles = getProfiles();
      const localIds = new Set(localProfiles.map((p) => p.id));
      const backendIds = new Set(backendProfiles.map((p) => p.id));

      // Add backend profiles that are missing locally
      const toAdd = backendProfiles.filter((p) => !localIds.has(p.id));
      if (toAdd.length > 0) {
        const merged = [
          ...localProfiles,
          ...toAdd.map((p) => ({
            id: p.id,
            name: p.name,
            createdAt: p.createdAt,
          })),
        ];
        saveProfiles(merged);
        setProfilesState(getProfiles());
      }

      // Push local-only non-default profiles to backend
      const localOnly = localProfiles.filter(
        (p) => p.id !== "default" && !backendIds.has(p.id),
      );
      for (const p of localOnly) {
        await saveLearnerProfileToBackend(actor, p).catch(() => {});
      }
    }
  }, []);

  return (
    <LearnerContext.Provider
      value={{
        activeProfile,
        profiles,
        setActiveProfile,
        createProfile,
        deleteProfile,
        syncProfilesFromBackend,
      }}
    >
      {children}
    </LearnerContext.Provider>
  );
}

export function useLearner(): LearnerContextType {
  const ctx = useContext(LearnerContext);
  if (!ctx) throw new Error("useLearner must be used within LearnerProvider");
  return ctx;
}
