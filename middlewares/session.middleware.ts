import { load } from "https://deno.land/std@0.198.0/dotenv/mod.ts";
import {
  CookieStore,
  Session,
} from "https://deno.land/x/oak_sessions@v4.1.9/mod.ts";

const env = await load({ export: true });
const secret = env.SECRET;

if (!secret) {
  console.error("%cNo secret found in .env file.", "color: red;");
  Deno.exit(1);
}

const store = new CookieStore(secret);

const sessionMiddleware = Session.initMiddleware(store, {
  cookieSetOptions: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  },
  expireAfterSeconds: 1800,
  sessionCookieName: "session",
});

export default sessionMiddleware;
