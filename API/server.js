const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// État du carton rouge
let redCardActive = false;

app.use(cors());
app.use(express.json());

const eventsFilePath = path.join(__dirname, "./event.json");

app.get("/events/:date", (req, res) => {
  const { date } = req.params;

  fs.readFile(eventsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file from disk:", err);
      return res.status(500).send("Unable to read event data");
    }
    try {
      const events = JSON.parse(data);
      const dayEvents = events[date] || [];
      res.json(dayEvents);
    } catch (err) {
      console.error("Error parsing JSON from file:", err);
      res.status(500).send("Error parsing event data");
    }
  });
});

// Route pour vérifier l'état du carton rouge
app.get("/check-red-card", (req, res) => {
  res.json({ redCardActive });
});

// Automatisation de l'émission d'un carton rouge toutes les 2 minutes
setInterval(() => {
  redCardActive = true;
  console.log("Red card issued automatically.");
  // Réinitialiser le carton rouge après 10 secondes pour le rendre prêt pour une autre vérification
  setTimeout(() => {
    redCardActive = false;
  }, 10000);
}, 120000); // 120000 ms = 2 minutes

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
