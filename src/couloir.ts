/// <reference types="@workadventure/iframe-api-typings" />

interface MapData {
  width: number;
  height: number;
  layers: Layer[];
}

interface Layer {
  name: string;
  data: number[];
}

interface Event {
  event_id: string;
  event: string;
  area_name: string;
  roomUrl: string;
}

interface Position {
  x: number;
  y: number;
}

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

WA.onInit()
  .then(async () => {
    console.log("Scripting API ready");

    setInterval(async () => {
      const position = await WA.player.getPosition();
      console.log(`Player position: x=${position.x}, y=${position.y}`);
    }, 1000);

    try {
      const rawMapData = await WA.room.getTiledMap();
      console.log(rawMapData)
      if (!rawMapData.width || !rawMapData.height || !rawMapData.layers) {
        throw new Error("Map data is incomplete or incorrect.");
      }

      const mapData: MapData = {
        width: rawMapData.width,
        height: rawMapData.height,
        layers: rawMapData.layers as Layer[],
      };

      const availablePositions = findAvailablePositions(mapData);
      const events = await loadEventsForToday();
      const numDoors = Math.min(events.length, availablePositions.length);

      if (events.length > 0 && numDoors > 0) {
        console.log("Events for today:", events);
        //
        const doorPositions = selectFarthestPositions(
          availablePositions,
          numDoors
        );
        console.log("Selected door positions:", doorPositions);
        let sizePositions = doorPositions.length;
        doorPositions.forEach((position, index) => {
          console.log(sizePositions);
          console.log(index);
          if(sizePositions - 1 === index){
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            createWallWCollision({ x: position.x, y: 0 }, mapData);
          }
          else{
            console.log("Creating door for event", events[index]);
            createDoorAtPosition(events[index], position, mapData);
          }

        });

      } else {
        console.log("Not enough positions or no events for today.");
      }
    } catch (error) {
      console.error("Failed to process map data:", error);
    }

    bootstrapExtra()
      .then(() => {
        console.log("Scripting API Extra ready");
      })
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));

function findAvailablePositions(mapData: MapData): Position[] {
  const wallLayer = mapData.layers.find((layer) => layer.name === "wall");
  const floorLayer = mapData.layers.find((layer) => layer.name === "woodfloor");
  if (!wallLayer || !floorLayer) {
    console.error("Required layers 'wall' or 'woodfloor' not found.");
    return [];
  }

  let width = mapData.width;
  let availablePositions: Position[] = [];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < mapData.height - 1; y++) {
      let wallIndex = y * width + x;
      let floorIndex = (y + 1) * width + x;
      if (
        wallLayer.data[wallIndex] !== 0 &&
        floorLayer.data[floorIndex] !== 0
      ) {
        availablePositions.push({ x: x * 32, y: y * 32 });
        break;
      }
    }
  }

  return availablePositions;
}

function selectFarthestPositions(
  positions: Position[],
  numDoors: number
): Position[] {
  if (positions.length <= numDoors) return positions;
  positions.sort((a, b) => a.x - b.x);
  const selectedPositions = [];
  //let step = Math.floor(positions.length / (numDoors - 1));
  let step = 6;
  console.log("Step @@@:", step);
  for (let i = 1; i <= numDoors + 1; i++) {
    selectedPositions.push(positions[i * step]);
  }
  console.log("Selected positions @@@:", selectedPositions);
  return selectedPositions;
}

async function loadEventsForToday(): Promise<Event[]> {
  try {
    /*const response = await fetch(
      "http://localhost:3000/events/" + new Date().toISOString().slice(0, 10)
    );*/
    const response = await fetch(
        "http://localhost:3000/events/today"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to load events:", error);
    return [];
  }
}

function createWallWCollision(
    position: { x: number; y: number },
    mapData: MapData
) {
  console.log("@@@ Attempting to create a wall at position", position);

  const collisionsTileId = 3;
  const wallTileId = 475;
  const collisionsLayerName = "collisions";
  const wallLayerName = "EndCorridor";

  const arrayDoor = [];
  console.log("====================@@@@@@@@@@@@@@==================");
  console.log("Position:", position);
  console.log("MapData:", mapData);
  for (let j = position.x/32; j < mapData.width; j++) {
    for (let i = 0; i < 9; i++) {
      const y = i; // La valeur de `y` varie de 0 à 8 à chaque itération

      // Première partie de l'objet avec collisionsTileId
      const collisionsObject = {
        x: Math.floor(j),
        y: y,
        tile: collisionsTileId,
        layer: collisionsLayerName,
      };

      // Deuxième partie de l'objet avec wallTileId
      const wallObject = {
        x: Math.floor(j),
        y: y,
        tile: wallTileId,
        layer: wallLayerName,
      };

      // Utilisation des objets créés ici (par exemple, les ajouter à un tableau ou les utiliser autrement)
      arrayDoor.push(collisionsObject);
      arrayDoor.push(wallObject);
    }
  }
  console.log("======================================");
  console.log("ArrayDoor:", arrayDoor);

  WA.room.setTiles(arrayDoor);
}

function createDoorAtPosition(
  event: Event,
  position: { x: number; y: number },
  mapData: MapData
) {
  console.log("Attempting to create door at position", position);

  const doorTileIdUpper = 1235;
  const doorTileIdLower = 1260;
  const doorLayerName = "DynamicDoors";

  const areaName = `area_${event.area_name}`
  console.log("Event:", event);
  console.log("Area name:", areaName);
  console.log("PositionX:", position.x - 48);
    console.log("PositionY:", position.y + 32);
  const area = WA.room.area.create({
    name: areaName,
    x: position.x - 48,
    y: position.y + 32,
    width: 32 * 4,
    height: 48,
  });

  console.log("Created area for event", areaName);
  console.log("exitUrl:", event.roomUrl + "?id=" + event.event_id);
  area.setProperty("exitUrl", event.roomUrl);

  WA.room.setTiles([
    {
      x: Math.floor(position.x / 32),
      y: Math.floor(position.y / 32) - 1,
      tile: doorTileIdUpper,
      layer: doorLayerName,
    },
    {
      x: Math.floor(position.x / 32),
      y: Math.floor(position.y / 32),
      tile: doorTileIdLower,
      layer: doorLayerName,
    },
  ]);

  const iframeWidth = 128;
  const iframeHeight = 32;
  let iframeX = position.x;

  if (iframeX + iframeWidth > mapData.width * 32) {
    iframeX = mapData.width * 32 - iframeWidth;
  }

  /*const iframeUrl = `http://localhost:5173/eventLabel.html?event=${encodeURIComponent(
    event.event
  )}`;*/
  const iframeUrl = `eventLabel.html?event=${encodeURIComponent(
      event.event
  )}`
  WA.room.website.create({
    name: `eventNameDisplay_${position.x}_${position.y}`,
    url: iframeUrl,
    position: {
      x: iframeX - 48,
      y: position.y - 64,
      width: iframeWidth,
      height: iframeHeight,
    },
    visible: true,
    allowApi: false,
    allow: "autoplay; fullscreen",
    origin: "map",
  });

  console.log("Iframe created for event", event.event);

  WA.room.area.onEnter(areaName).subscribe(() => {
    WA.ui.openPopup("eventPopup", `Welcome to the event: ${event.event}`, [
      {
        label: "Close",
        callback: (popup) => {
          popup.close();
        },
      },
    ]);
  });
}
