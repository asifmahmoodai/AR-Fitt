import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./worker.js";

const port = parseInt(process.env.EXPRESS_APP_PORT || "3001", 10);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server is listening on port ${info.port}`);
});
