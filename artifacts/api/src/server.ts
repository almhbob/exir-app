import http from "http";

import { handleError, sendJson } from "./http";
import { route } from "./routes";

const port = Number.parseInt(process.env.API_PORT ?? process.env.PORT ?? "8080", 10);

const server = http.createServer(async (req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "content-type, x-user-id");
  res.setHeader("access-control-allow-methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    sendJson(res, 204, null);
    return;
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  try {
    await route(req, res, url);
  } catch (error) {
    handleError(res, error);
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Exir API running on port ${port}`);
});
