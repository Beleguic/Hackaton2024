/// <reference types="@workadventure/iframe-api-typings" />

//import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");
WA.onInit()
    .then(async () => {
        console.log("Scripting API ready");

        // Get an existing website object where 'my_website' is the name of the object (on any layer object of the map)
        const website = await WA.room.website.get("video-player");
        website.url = "video_youtube_2.html";
        website.visible = true;

    });
