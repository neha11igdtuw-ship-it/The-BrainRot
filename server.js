// Tiny dependency-free server for Render / any Node host: serves the static site and /api/roast.
const http = require("http"), fs = require("fs"), path = require("path");
const roast = require("./api/roast.js");
const ROOT = __dirname, PORT = process.env.PORT || 3000;
const FILES = {
  "/": "index.html", "/index.html": "index.html", "/style.css": "style.css", "/data.js": "data.js", "/app.js": "app.js",
  "/roast.js": "roast.js", "/extras.js": "extras.js", "/sw.js": "sw.js", "/icon.svg": "icon.svg", "/manifest.webmanifest": "manifest.webmanifest"
};
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };

http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  if (url === "/api/roast") {
    let body = "", size = 0;
    req.on("data", (d) => { size += d.length; if (size > 20000) { res.statusCode = 413; res.end(); req.destroy(); } else body += d; });
    req.on("end", () => {
      if (res.writableEnded) return;
      if (body) { try { req.body = JSON.parse(body); } catch (e) { req.body = null; } }
      res.status = (c) => { res.statusCode = c; return res; };
      res.json = (x) => { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(x)); };
      Promise.resolve(roast(req, res)).catch(() => { if (!res.writableEnded) res.status(500).json({ error: "server" }); });
    });
    return;
  }
  const f = FILES[url];
  if (!f) { res.statusCode = 404; return res.end("Not found"); }
  fs.readFile(path.join(ROOT, f), (e, d) => {
    if (e) { res.statusCode = 404; return res.end("Not found"); }
    res.setHeader("content-type", TYPES[path.extname(f)] || "text/plain");
    if (f === "sw.js") res.setHeader("cache-control", "no-cache");
    res.end(d);
  });
}).listen(PORT, () => console.log("Brainrot on :" + PORT));
