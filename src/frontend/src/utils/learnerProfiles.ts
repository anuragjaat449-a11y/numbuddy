export interface LearnerProfile {
  id: string;
  name: string;
  createdAt: string;
}

export const DEFAULT_PROFILE: LearnerProfile = {
  id: "default",
  name: "Default Learner",
  createdAt: "",
};

const PROFILES_KEY = "numbuddy_profiles";
const ACTIVE_PROFILE_KEY = "numbuddy_active_profile";

export function getProfiles(): LearnerProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) return [DEFAULT_PROFILE];
    const parsed = JSON.parse(raw) as LearnerProfile[];
    // Always ensure default is first
    const hasDefault = parsed.some((p) => p.id === "default");
    if (!hasDefault) parsed.unshift(DEFAULT_PROFILE);
    return parsed.length > 0 ? parsed : [DEFAULT_PROFILE];
  } catch {
    return [DEFAULT_PROFILE];
  }
}

export function saveProfiles(profiles: LearnerProfile[]): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function createProfile(name: string): LearnerProfile {
  const profile: LearnerProfile = {
    id: `profile_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim().slice(0, 20),
    createdAt: new Date().toISOString(),
  };
  const profiles = getProfiles();
  profiles.push(profile);
  saveProfiles(profiles);
  return profile;
}

export function deleteProfile(id: string): void {
  if (id === "default") return;
  const profiles = getProfiles().filter((p) => p.id !== id);
  saveProfiles(profiles);
  localStorage.removeItem(`numbuddy_progress_${id}`);
  if (getActiveProfileId() === id) {
    setActiveProfileId("default");
  }
}

export function getActiveProfileId(): string {
  return localStorage.getItem(ACTIVE_PROFILE_KEY) ?? "default";
}

export function setActiveProfileId(id: string): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

export function getProgressKey(profileId: string): string {
  return profileId === "default"
    ? "numbuddy_progress"
    : `numbuddy_progress_${profileId}`;
}
