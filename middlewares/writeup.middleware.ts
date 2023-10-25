import { Context, Next } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { checkAuth } from "../validations/auth.validation.ts";

const getWriteupsMiddleware = async (ctx: Context, next: Next) => {
  const auth = await checkAuth(ctx);
  if (!auth) {
    ctx.response.status = 403;
    return (ctx.response.body = {
      message: "User not authorized.",
    });
  }

  await next();
};

export { getWriteupsMiddleware };
