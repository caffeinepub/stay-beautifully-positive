import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let dailyTrackers = Map.empty<Principal, DailyTracker>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  type DailyTracker = {
    streakCount : Nat;
    lastCheckInDay : Int;
  };

  type DailyMessage = {
    id : Nat;
    message : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let dailyMessages : [DailyMessage] = [
    {
      id = 1;
      message = "Today is a new day. Embrace it with positivity!";
    },
  ];

  // Public query - accessible to all including guests
  public query ({ caller }) func getDailyMessages() : async [DailyMessage] {
    dailyMessages;
  };

  // Public query - accessible to all including guests
  public query ({ caller }) func getDailyMessage() : async { message : Text } {
    { message = "Stay Beautifully Positive" };
  };

  // Requires user authentication to upload content
  public shared ({ caller }) func uploadBackgroundMusic(_metadata : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload background music");
    };
  };

  func getCurrentUTCDay() : Int {
    Time.now() / 86_400_000_000_000;
  };

  // Users can only update their own daily tracker
  public shared ({ caller }) func updateDailyTracker() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update daily tracker");
    };

    let currentDay = getCurrentUTCDay();

    var newStreak = 1;
    switch (dailyTrackers.get(caller)) {
      case (?tracker) {
        if (tracker.lastCheckInDay == currentDay) {
          return tracker.streakCount;
        } else if (tracker.lastCheckInDay == currentDay - 1) {
          newStreak := tracker.streakCount + 1;
        };
      };
      case (_) {};
    };

    let updatedTracker = {
      streakCount = newStreak;
      lastCheckInDay = currentDay;
    };

    dailyTrackers.add(caller, updatedTracker);
    newStreak;
  };

  // Public query - streaks are public information (leaderboard feature)
  public query ({ caller }) func getUserStreak(user : Principal) : async Nat {
    switch (dailyTrackers.get(user)) {
      case (?tracker) { tracker.streakCount };
      case (null) { 0 };
    };
  };

  // Public query - accessible to all for leaderboard functionality
  public query ({ caller }) func getAllStreaksNonEmpty() : async [(Principal, Nat)] {
    dailyTrackers.toArray().map(func((p, t)) { (p, t.streakCount) });
  };

  // User profile management - users can view their own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  // Users can view their own profile, admins can view any profile
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Users can only save their own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
