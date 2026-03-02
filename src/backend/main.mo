import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  var nextJobId = 0;

  let jobs = Map.empty<Int, VideoJob>();
  let jobComments = Map.empty<Int, List.List<Text>>();
  let imageAssets = Map.empty<Text, Storage.ExternalBlob>();
  let musicAssets = Map.empty<Text, Storage.ExternalBlob>();

  type VideoJob = {
    id : Int;
    owner : Principal;
    imageAssetId : Text;
    prompt : Text;
    voiceGender : Text;
    voiceLanguage : Text;
    musicTrackId : Text;
    subtitlesEnabled : Bool;
    resolution : Text;
    mode : Text;
  };

  type VideoJobInput = {
    imageAssetId : Text;
    prompt : Text;
    voiceGender : Text;
    voiceLanguage : Text;
    musicTrackId : Text;
    subtitlesEnabled : Bool;
    resolution : Text;
    mode : Text;
  };

  func generateId() : Int {
    let id = nextJobId;
    nextJobId += 1;
    id;
  };

  public shared ({ caller }) func uploadImageAsset(id : Text, blob : Storage.ExternalBlob) : async () {
    imageAssets.add(id, blob);
  };

  public shared ({ caller }) func uploadMusicAsset(id : Text, blob : Storage.ExternalBlob) : async () {
    musicAssets.add(id, blob);
  };

  public query ({ caller }) func getImageAsset(id : Text) : async ?Storage.ExternalBlob {
    imageAssets.get(id);
  };

  public query ({ caller }) func getMusicAsset(id : Text) : async ?Storage.ExternalBlob {
    musicAssets.get(id);
  };

  public query ({ caller }) func jobsCount() : async Nat {
    jobs.size();
  };

  public query ({ caller }) func getJobComments(jobId : Int) : async [Text] {
    switch (jobComments.get(jobId)) {
      case (null) { [] };
      case (?comments) { comments.toArray() };
    };
  };

  public shared ({ caller }) func createJob(input : VideoJobInput) : async Int {
    let id = generateId();

    let job : VideoJob = {
      id;
      owner = caller;
      imageAssetId = input.imageAssetId;
      prompt = input.prompt;
      voiceGender = input.voiceGender;
      voiceLanguage = input.voiceLanguage;
      musicTrackId = input.musicTrackId;
      subtitlesEnabled = input.subtitlesEnabled;
      resolution = input.resolution;
      mode = input.mode;
    };

    jobs.add(id, job);
    id;
  };

  public shared ({ caller }) func addJobComment(jobId : Int, comment : Text) : async () {
    switch (jobs.get(jobId)) {
      case (null) {};
      case (?_) {
        let comments = switch (jobComments.get(jobId)) {
          case (null) { List.empty<Text>() };
          case (?existing) { existing };
        };

        comments.add(comment);
        jobComments.add(jobId, comments);
      };
    };
  };

  func jobExists(id : Int) : Bool {
    jobs.containsKey(id);
  };

  public query ({ caller }) func filterByMode(mode : Text) : async [VideoJob] {
    jobs.toArray().filter(
      func((_, job)) { Text.equal(job.mode, mode) }
    ).map(func((_, job)) { job });
  };

  public query ({ caller }) func filterByVoiceGender(gender : Text) : async [VideoJob] {
    jobs.toArray().filter(
      func((_, job)) { Text.equal(job.voiceGender, gender) }
    ).map(func((_, job)) { job });
  };

  public query ({ caller }) func transformLanguage() : async [Text] {
    jobs.toArray().map(
      func((_, job)) { job.voiceLanguage # " transformed" }
    );
  };
};
