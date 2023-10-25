import { Context } from "https://deno.land/x/oak@v12.6.0/mod.ts";

const checkAuth = async (ctx: Context, id?: number) => {
  const session = await ctx.state.session;
  const auth = await session.get("authenticated");
  if (!auth) {
    return false;
  }

  const isAdmin = await session.get("role");
  if (isAdmin === "admin") {
    return true;
  }

  const sessionId = await session.get("id");
  if (id && id !== parseInt(sessionId)) {
    return false;
  }

  return true;
};

export { checkAuth };
