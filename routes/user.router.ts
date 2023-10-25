import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  getUsersHandler,
  updatePasswordHandler,
  updateUserHandler,
} from "../handlers/user.handler.ts";
import {
  createUserMiddleware,
  deleteUserMiddleware,
  getUserMiddleware,
  getUsersMiddleware,
  updatePasswordMiddleware,
  updateUserMiddleware,
} from "../middlewares/user.middleware.ts";
import AppState from "../schemas/AppState.ts";

const userRouter = new Router<AppState>();

userRouter
  .get("/api/users", getUsersMiddleware, getUsersHandler)
  .get("/api/users/:id", getUserMiddleware, getUserHandler)
  .post("/api/users", createUserMiddleware, createUserHandler)
  .put("/api/users/:id", updateUserMiddleware, updateUserHandler)
  .patch("/api/users/:id", updatePasswordMiddleware, updatePasswordHandler)
  .delete("/api/users/:id", deleteUserMiddleware, deleteUserHandler);

export default userRouter;
