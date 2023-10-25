import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import {
  createWriteupHandler,
  getWriteupHandler,
  getWriteupsHandler,
} from "../handlers/writeups.handler.ts";
import { getWriteupsMiddleware } from "../middlewares/writeup.middleware.ts";
import AppState from "../schemas/AppState.ts";

const writeupRouter = new Router<AppState>();

writeupRouter
  .get("/api/writeups", getWriteupsMiddleware, getWriteupsHandler)
  .get("/api/writeups/:id", getWriteupHandler)
  .post("/api/writeups", createWriteupHandler)
  .put("/api/writeups/:id", () => {})
  .delete("/api/writeups/:id", () => {});

export default writeupRouter;
