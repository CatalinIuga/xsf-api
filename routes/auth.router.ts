import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  sessionHandler,
} from "../handlers/auth.handler.ts";
import AppState from "../schemas/AppState.ts";

const authRouter = new Router<AppState>();

authRouter
  .get("/api/auth/session", sessionHandler)
  .post("/api/auth/login", loginHandler)
  .post("/api/auth/logout", logoutHandler)
  .post("/api/auth/reset", forgotPasswordHandler);

export default authRouter;
