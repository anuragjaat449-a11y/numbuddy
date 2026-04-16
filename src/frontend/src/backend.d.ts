import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type CategoryId = string;
export interface LearnerProfile {
    id: string;
    name: string;
    createdAt: string;
}
export interface NumBuddySession {
    categoryId: CategoryId;
    total: bigint;
    date: string;
    difficulty: string;
    score: bigint;
    learnerId: string;
}
export interface UserProfile {
    name: string;
}
export interface CatSessions {
    categoryId: CategoryId;
    learnerId: string;
    sessions: Array<NumBuddySession>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkImportSessions(catSessions: Array<CatSessions>): Promise<void>;
    deleteLearnerProfile(id: string): Promise<void>;
    deleteSessionsByLearner(learnerId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLearnerProfiles(): Promise<Array<LearnerProfile>>;
    getSessionsByCategory(categoryId: string): Promise<Array<NumBuddySession>>;
    getSessionsByLearner(learnerId: string): Promise<Array<CatSessions>>;
    getSessionsByUser(): Promise<Array<CatSessions>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeAllSessions(user: Principal): Promise<void>;
    removeSessions(categoryId: string): Promise<void>;
    reset(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveLearnerProfile(profile: LearnerProfile): Promise<void>;
    saveSession(session: NumBuddySession): Promise<void>;
}
