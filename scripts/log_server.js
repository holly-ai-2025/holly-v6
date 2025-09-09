const http = require("http");
const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "../logs/frontend-console.log");

if (!fs.existsSync(path.dirname(LOG_FILE))) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "POST") {
    if (req.url === "/" || req.url === "/log") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          const logEntry = JSON.parse(body);
          const timestamp = new Date().toISOString();
          const line = `[${timestamp}] [${(logEntry.level || "log").toUpperCase()}] ${logEntry.message}\n`;
          fs.appendFileSync(LOG_FILE, line);
        } catch (err) {
          console.error("Failed to parse log entry", err);
        }
        res.writeHead(200);
        res.end("OK");
      });
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(9000, () => {
  console.log("✅ Frontend log server running on http://localhost:9000 (accepting / and /log)");
});