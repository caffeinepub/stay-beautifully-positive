import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type InspirationalMessage = {
    text : Text;
    author : Text;
    category : Text;
  };

  let messages : [InspirationalMessage] = [
    {
      text = "Believe you can and you’re halfway there.";
      author = "Theodore Roosevelt";
      category = "Motivation";
    },
    {
      text = "You are enough just as you are.";
      author = "Unknown";
      category = "Affirmation";
    },
    {
      text = "Every day is a new beginning. Take a deep breath, smile, and start again.";
      author = "Unknown";
      category = "Positivity";
    },
    {
      text = "Your mind is a powerful thing. When you fill it with positive thoughts, your life will start to change.";
      author = "Unknown";
      category = "Mindfulness";
    },
    {
      text = "Stay positive, work hard, make it happen.";
      author = "Unknown";
      category = "Motivation";
    },
    {
      text = "You have within you right now, everything you need to deal with whatever the world can throw at you.";
      author = "Brian Tracy";
      category = "Strength";
    },
    {
      text = "Happiness is not something ready made. It comes from your own actions.";
      author = "Dalai Lama";
      category = "Happiness";
    },
    {
      text = "The only way to do great work is to love what you do.";
      author = "Steve Jobs";
      category = "Inspiration";
    },
    {
      text = "You are capable of amazing things.";
      author = "Unknown";
      category = "Affirmation";
    },
    {
      text = "Positive thinking will let you do everything better than negative thinking will.";
      author = "Zig Ziglar";
      category = "Positivity";
    },
  ];

  public query ({ caller }) func getDailyMessage() : async InspirationalMessage {
    let currentTime = Time.now();
    let daysSinceEpoch = currentTime / (24 * 60 * 60 * 1_000_000_000);
    let messageIndex = (daysSinceEpoch % messages.size()).toNat() % messages.size();
    messages[messageIndex];
  };

  public shared ({ caller }) func uploadBackgroundMusic(metadata : Storage.ExternalBlob) : async () {
    Runtime.trap("This function is implemented by the blob-storage component, see initialize for details");
  };

  public query ({ caller }) func getAllMessages() : async [InspirationalMessage] {
    messages;
  };

  public query ({ caller }) func getMessageByCategory(category : Text) : async [InspirationalMessage] {
    messages.filter(func(message) { message.category == category });
  };

  public query ({ caller }) func getAppMotto() : async Text {
    "Stay Beautifully Positive";
  };
};
