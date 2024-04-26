/// <reference types="@workadventure/iframe-api-typings" />

//import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");


WA.onInit()
    .then(async () => {
            console.log("Scripting API ready");

            let sport = WA.room.hashParameters.sport;
            sport = decodeURI(sport);
            console.log(sport);

            if(sport === "Football"){
                WA.room.showLayer("floors/foot");
                WA.room.hideLayer("floors/floorblue");
            }
            else if(sport === "Formule 1") {
                WA.room.showLayer("floors/formuleone");
                WA.room.hideLayer("floors/floorblue");
            }
            else{
                WA.room.showLayer("floors/floorblue");
                WA.room.hideLayer("floors/foot");
                WA.room.hideLayer("floors/formuleone");
            }

            // Get an existing website object where 'my_website' is the name of the object (on any layer object of the map)
            const website = await WA.room.website.get("video-player");
            website.url = "video_youtube.html?video=" + sport;
            website.visible = true;

            const score = await WA.room.website.get("score-player");
            score.url = "score.html?video=" + sport;
            score.visible = true;



    });
