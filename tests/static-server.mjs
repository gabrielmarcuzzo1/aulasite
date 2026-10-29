import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";

// Like a cPanel subfolder: no SPA fallback, asset rewrites or root-level assets.
const root = resolve("dist");
const mount = "/aulademo/";
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (!pathname.startsWith(mount)) throw new Error("Outside mount");
    const path = resolve(root, pathname.slice(mount.length) || "index.html");
    if (relative(root, path).startsWith("..")) throw new Error("Outside root");
    const content = await readFile(path);
    response.writeHead(200, {
      "Content-Type": types[extname(path)] || "application/octet-stream",
    });
    response.end(content);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not found");
  }
}).listen(4176, "127.0.0.1");
