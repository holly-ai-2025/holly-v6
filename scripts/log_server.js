const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 9000;
const LOG_FILE = path.join(__dirname, "../logs/frontend-console.log");

app.use(express.json());

app.post("/log", (req, res) => {
  const { level = "info", message = "", data = [] } = req.body;
  const entry = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message} ${JSON.stringify(
    data
  )}\n`;

  fs.appendFileSync(LOG_FILE, entry);
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Frontend log server running on http://localhost:${PORT}`);
});