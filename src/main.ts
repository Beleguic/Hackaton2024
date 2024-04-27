/// <reference types="@workadventure/iframe-api-typings" />

//import { bootstrapExtra } from "@workadventure/scripting-api-extra";


WA.onInit().then(async () => {
  console.log("Scripting API ready");

  let chaine = WA.room.hashParameters.sport;
  let parties: string[] = chaine.split("$");
  console.log(parties);
  let sport = decodeURI(parties[0]);
  let id_event = decodeURI(parties[1]);

  console.log(sport);
  console.log(id_event);

  switch (sport) {
    case "football":
      WA.room.showLayer("floors/foot");
      WA.room.hideLayer("floors/floorblue");
      break;
    case "f1":
      WA.room.showLayer("floors/formuleone");
      WA.room.hideLayer("floors/floorblue");
      break;
    default:
      WA.room.showLayer("floors/floorblue");
      WA.room.hideLayer("floors/foot");
      WA.room.hideLayer("floors/formuleone");
      break;
  }

  const website = await WA.room.website.get("video-player");
  website.url = "video_youtube.html?video=" + id_event;
  website.visible = true;

  const score = await WA.room.website.get("score-player");
  score.url = "score.html?score=" + id_event;
  score.visible = true;

  setupPolling();
});

function setupPolling() {
  console.log("Setting up dynamic event polling for card events");
  setInterval(() => {
    const randomEvent = Math.random();
    if (randomEvent < 0.5) {
      playCardSound();
      showRedCardLayer();
      console.log("Red card event simulated!");
    } else {
      playCardSound();
      showYellowCardLayer();
      console.log("Yellow card event simulated!");
    }
  }, 300000); // 5 minutes
}

function playCardSound() {
  const source =
    "https://cdn.pixabay.com/audio/2023/04/23/audio_65f312a7c6.mp3";
  var audio = document.createElement("audio");
  audio.autoplay = true;
  audio.load();
  audio.addEventListener(
    "load",
    function () {
      audio.play();
    },
    true
  );
  audio.src = source;
}
function showRedCardLayer() {
  WA.room.showLayer("carton/carton-rouge");
  setTimeout(() => {
    WA.room.hideLayer("carton/carton-rouge");
  }, 10000);
}

function showYellowCardLayer() {
  WA.room.showLayer("carton/carton-jaune");
  setTimeout(() => {
    WA.room.hideLayer("carton/carton-jaune");
  }, 10000);
}
export {};
// Your existing code follows
