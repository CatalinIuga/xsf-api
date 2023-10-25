import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Application } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import database from "./database/connection.ts";
import sessionMiddleware from "./middlewares/session.middleware.ts";
import authRouter from "./routes/auth.router.ts";
import userRouter from "./routes/user.router.ts";
import writeupRouter from "./routes/writeup.router.ts";
import AppState from "./schemas/AppState.ts";

const app = new Application<AppState>();

app.addEventListener("error", (evt) => {
  console.error(evt.error);
});

// @ts-expect-error - > misconfig of types between oak_sessions and oak
app.use(sessionMiddleware);

app.use(
  oakCors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    exposedHeaders: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Credentials",
      "Content-Type",
      "Set-Cookie",
    ],
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Credentials",
      "Content-Type",
      "Set-Cookie",
    ],
    methods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(authRouter.routes());
app.use(authRouter.allowedMethods());

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(writeupRouter.routes());
app.use(writeupRouter.allowedMethods());

console.log("Server running on port %c8000", "color: green;");
await app.listen({ port: 8000 });

database.close();
