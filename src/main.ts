/// <reference types="@workadventure/iframe-api-typings" />

//import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

WA.onInit().then(async () => {
  console.log("Scripting API ready");
  let sport = WA.room.hashParameters.sport;
  sport = decodeURI(sport);
  console.log(sport);

  switch (sport) {
    case "Football":
      WA.room.showLayer("floors/foot");
      WA.room.hideLayer("floors/floorblue");
      break;
    case "Formule 1":
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
  website.url = "video_youtube.html?video=" + sport;
  website.visible = true;

  const score = await WA.room.website.get("score-player");
  score.url = "score.html?video=" + sport;
  score.visible = true;

  setupPolling();
});

function setupPolling() {
  setInterval(async () => {
    try {
      const response = await fetch("http://localhost:3000/check-red-card");
      const data = await response.json();
      console.log(data);
      if (data.redCardActive) {
        playRedCardSound();
        showRedCardLayer();
        console.log("Red card event detected!");
      }
      if (data.yellowCardActive) {
        playYellowCardSound();
        showYellowCardLayer();
        console.log("Yellow card event detected!");
      }
    } catch (error) {
      console.error("Failed to fetch card status:", error);
    }
  }, 30000); // Ajusté à 30 secondes pour moins de charge
}

function playRedCardSound() {
  const audio = new Audio("../public/sound/red.mp3");
  audio.play();
}

function showRedCardLayer() {
  WA.room.showLayer("carton/carton-rouge");
  setTimeout(() => {
    WA.room.hideLayer("carton/carton-rouge");
  }, 20000);
}

function playYellowCardSound() {
  const audio = new Audio("../public/sound/red.mp3");
  audio.play();
}

function showYellowCardLayer() {
  WA.room.showLayer("carton/carton-jaune");
  setTimeout(() => {
    WA.room.hideLayer("carton/carton-jaune");
  }, 20000);
}
