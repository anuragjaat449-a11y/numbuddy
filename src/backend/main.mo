import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";

// Use data migration

actor {
  type CategoryId = Text;

  public type NumBuddySession = {
    learnerId : Text;
    categoryId : CategoryId;
    score : Nat;
    total : Nat;
    difficulty : Text;
    date : Text;
  };

  public type CatSessions = {
    learnerId : Text;
    categoryId : CategoryId;
    sessions : [NumBuddySession];
  };

  public type UserProfile = {
    name : Text;
  };

  public type LearnerProfile = {
    id : Text;
    name : Text;
    createdAt : Text;
  };

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let sessionStore = Map.empty<
    Principal,
    Map.Map<Text, [NumBuddySession]>
  >();

  let userProfiles = Map.empty<Principal, UserProfile>();
  let learnerProfileStore = Map.empty<Principal, [LearnerProfile]>();

  // Maximum sessions stored per category per user
  let MAX_SESSIONS_PER_CATEGORY : Nat = 50;

  // Maximum number of learner profiles per user
  let MAX_LEARNER_PROFILES : Nat = 20;

  // Helper: keep only the last `max` elements of an array
  func capArray(arr : [NumBuddySession], max : Nat) : [NumBuddySession] {
    let n = arr.size();
    if (n <= max) { return arr };
    let start = n - max;
    Array.tabulate<NumBuddySession>(max, func(i) { arr[start + i] });
  };

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper function to get or create user sessions
  func getUserSessionsInternal(user : Principal) : Map.Map<Text, [NumBuddySession]> {
    switch (sessionStore.get(user)) {
      case (?sessions) { sessions };
      case (null) {
        let newSessions = Map.empty<Text, [NumBuddySession]>();
        sessionStore.add(user, newSessions);
        newSessions;
      };
    };
  };

  public shared ({ caller }) func saveSession(session : NumBuddySession) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save sessions");
    };

    let userSessions = getUserSessionsInternal(caller);

    let existingSessions = switch (userSessions.get(session.categoryId)) {
      case (null) { [] };
      case (?sessions) { sessions };
    };

    // Deduplicate by date: skip if a session with the same date already exists
    let alreadyExists = existingSessions.find(func(s) { s.date == session.date });
    switch (alreadyExists) {
      case (?_) { /* duplicate, skip */ };
      case (null) {
        let appended = existingSessions.concat([session]);
        userSessions.add(session.categoryId, capArray(appended, MAX_SESSIONS_PER_CATEGORY));
      };
    };
  };

  public query ({ caller }) func getSessionsByUser() : async [CatSessions] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access sessions");
    };

    let userSessions = switch (sessionStore.get(caller)) {
      case (null) { Map.empty<Text, [NumBuddySession]>() };
      case (?sessions) { sessions };
    };

    let categories = userSessions.toArray();
    categories.map(
      func((categoryId, sessions)) {
        // Use the learnerId from the first session, or "default" if empty
        let learnerId = if (sessions.size() > 0) { sessions[0].learnerId } else { "default" };
        {
          learnerId;
          categoryId;
          sessions;
        };
      }
    );
  };

  public query ({ caller }) func getSessionsByCategory(categoryId : Text) : async [NumBuddySession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access sessions");
    };

    let userSessions = switch (sessionStore.get(caller)) {
      case (null) { Map.empty<Text, [NumBuddySession]>() };
      case (?sessions) { sessions };
    };

    switch (userSessions.get(categoryId)) {
      case (null) { [] };
      case (?sessions) { sessions };
    };
  };

  public query ({ caller }) func getSessionsByLearner(learnerId : Text) : async [CatSessions] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access sessions");
    };

    let userSessions = switch (sessionStore.get(caller)) {
      case (null) { Map.empty<Text, [NumBuddySession]>() };
      case (?sessions) { sessions };
    };

    let categories = userSessions.toArray();
    categories.map(
      func((categoryId, sessions)) {
        {
          learnerId;
          categoryId;
          sessions;
        };
      }
    );
  };

  public shared ({ caller }) func deleteSessionsByLearner(learnerId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete sessions");
    };

    let userSessions = switch (sessionStore.get(caller)) {
      case (null) { Map.empty<Text, [NumBuddySession]>() };
      case (?sessions) { sessions };
    };

    let filteredCategoryKeys = userSessions.toArray().filter(
      func((categoryId, sessions)) {
        switch (sessions.find(func(session) { session.learnerId == learnerId })) {
          case (null) { false };
          case (?_) { true };
        };
      }
    ).map(
      func((categoryId, _)) { categoryId }
    );

    for (categoryId in filteredCategoryKeys.values()) {
      let filteredSessions = switch (userSessions.get(categoryId)) {
        case (?sessions) {
          sessions.filter(
            func(session) { session.learnerId != learnerId }
          );
        };
        case (null) { [] };
      };

      if (filteredSessions.size() > 0) {
        userSessions.add(categoryId, filteredSessions);
      } else {
        userSessions.remove(categoryId);
      };
    };
  };

  public shared ({ caller }) func bulkImportSessions(catSessions : [CatSessions]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can import sessions");
    };

    let userSessions = getUserSessionsInternal(caller);

    for (catSession in catSessions.values()) {
      let existing = switch (userSessions.get(catSession.categoryId)) {
        case (?s) { s };
        case (null) { [] };
      };

      // Merge: keep existing sessions, add only incoming sessions not already present (by date)
      let existingDates = existing.map(func(s) { s.date });
      let newOnly = catSession.sessions.filter(
        func(s) {
          switch (existingDates.find(func(d) { d == s.date })) {
            case (?_) { false };
            case (null) { true };
          };
        }
      );
      let merged = existing.concat(newOnly);
      userSessions.add(catSession.categoryId, capArray(merged, MAX_SESSIONS_PER_CATEGORY));
    };
  };

  public shared ({ caller }) func removeSessions(categoryId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove sessions");
    };

    let userSessions = switch (sessionStore.get(caller)) {
      case (null) { Map.empty<Text, [NumBuddySession]>() };
      case (?sessions) { sessions };
    };

    userSessions.remove(categoryId);
  };

  public shared ({ caller }) func removeAllSessions(user : Principal) : async () {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only remove your own sessions or must be admin");
    };

    sessionStore.remove(user);
  };

  public shared ({ caller }) func reset() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reset the system");
    };

    sessionStore.clear();
    userProfiles.clear();
    learnerProfileStore.clear();
  };

  // Learner Profiles
  public query ({ caller }) func getLearnerProfiles() : async [LearnerProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access learner profiles");
    };
    switch (learnerProfileStore.get(caller)) {
      case (?profiles) { profiles };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func saveLearnerProfile(profile : LearnerProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save learner profiles");
    };

    if (profile.name.trim(#char ' ').size() == 0) {
      Runtime.trap("Cannot save with empty name");
    };

    // Ensure name is at most 20 chars
    let nameChars = profile.name.toArray();
    let trimmedName = if (nameChars.size() > 20) {
      Text.fromArray(nameChars.sliceToArray(0, 20));
    } else {
      profile.name;
    };

    let updatedProfile = {
      profile with
      name = trimmedName;
    };

    let idChars = profile.id.toArray();
    let updatedProfileId = {
      updatedProfile with
      id = if (idChars.size() > 20) {
        Text.fromArray(idChars.sliceToArray(0, 20));
      } else {
        profile.id;
      };
    };

    let existingProfiles = switch (learnerProfileStore.get(caller)) {
      case (?profiles) { profiles };
      case (null) { [] };
    };

    let isNewProfile = existingProfiles.find(func(p) { p.id == updatedProfileId.id }) == null;

    // Create empty array of same type as existingProfiles to allow concatenation
    let emptyProfiles : [LearnerProfile] = [];
    if (isNewProfile and ((existingProfiles.concat(emptyProfiles)).size() >= MAX_LEARNER_PROFILES)) {
      Runtime.trap("Cannot add more than " # MAX_LEARNER_PROFILES.toText() # " learner profiles");
    };

    // Filter out any existing profile with the same id and add the new one
    let profilesArray = existingProfiles.filter(
      func(p) { p.id != updatedProfileId.id }
    ).concat([updatedProfileId]);

    learnerProfileStore.add(caller, profilesArray);
  };

  public shared ({ caller }) func deleteLearnerProfile(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete learner profiles");
    };

    if (id == "default") {
      Runtime.trap("Cannot delete default profile");
    };

    let existingProfiles = switch (learnerProfileStore.get(caller)) {
      case (?profiles) { profiles };
      case (null) { [] };
    };

    let profilesArray = existingProfiles.filter(
      func(p) { p.id != id }
    );

    learnerProfileStore.add(caller, profilesArray);
  };
};
