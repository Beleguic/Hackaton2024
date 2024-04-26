const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

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

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
