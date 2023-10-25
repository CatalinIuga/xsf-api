import { Context, Next } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { checkAuth } from "../validations/auth.validation.ts";
import validateUser, {
  idCheck,
  passwordCheck,
} from "../validations/user.validation.ts";

const createUserMiddleware = async (ctx: Context, next: Next) => {
  const { username, email, password } = await ctx.request.body().value;

  const validationError = validateUser(username, email, password);
  if (validationError) {
    ctx.response.status = 400;
    return (ctx.response.body = { message: validationError });
  }

  await next();
};

const getUsersMiddleware = async (ctx: Context, next: Next) => {
  const auth = await checkAuth(ctx);
  if (!auth) {
    ctx.response.status = 403;
    return (ctx.response.body = {
      message: "User not authorized.",
    });
  }

  await next();
};

const getUserMiddleware = async (ctx: Context, next: Next) => {
  const auth = await checkAuth(ctx);
  if (!auth) {
    ctx.response.status = 403;
    return (ctx.response.body = {
      message: "User not authorized.",
    });
  }

  const id = ctx.request.url.pathname.split("/")[3];
  const validationError = idCheck(id);
  if (validationError) {
    ctx.response.status = 400;
    return (ctx.response.body = { message: validationError });
  }
  await next();
};

const updateUserMiddleware = async (ctx: Context, next: Next) => {
  const auth = await checkAuth(ctx);
  const admin = await ctx.state.session.get("role");
  if (auth && admin !== "admin") {
    ctx.response.status = 403;
    return (ctx.response.body = {
      message: "User not authorized.",
    });
  }

  const id = ctx.request.url.pathname.split("/")[3];
  const validationError = idCheck(id);
  if (validationError) {
    ctx.response.status = 400;
    return (ctx.response.body = { message: validationError });
  }

  const { username, email } = await ctx.request.body().value;

  const userError = validateUser(username, email);
  if (userError) {
    ctx.response.status = 400;
    return (ctx.response.body = { message: validationError });
  }

  await next();
};

const updatePasswordMiddleware = async (ctx: Context, next: Next) => {
  const auth = await checkAuth(ctx);
  if (!auth) {
    ctx.response.status = 403;
    return (ctx.response.body = {
      message: "User not authorized.",
    });
  }

  const id = ctx.request.url.pathname.split("/")[3];
  const validationError = idCheck(id);
  if (validationError) {
    ctx.response.status = 400;
    return (ctx.response.body = { message: validationError });
  }
  console.log(await ctx.request.body().value);

  const { password, newPassword } = await ctx.request.body().value;

  const passwordError = passwordCheck(password);
  console.log(password, passwordError);

  if (passwordError) {
    ctx.response.status = 400;
    return (ctx.response.body = { message: passwordError });
  }

  const newPasswordError = passwordCheck(newPassword);
  if (newPasswordError) {
    ctx.response.status = 400;
    return (ctx.response.body = { message: newPasswordError });
  }

  await next();
};

const deleteUserMiddleware = async (ctx: Context, next: Next) => {
  const auth = await checkAuth(ctx);
  const admin = await ctx.state.session.get("role");
  if (auth && admin !== "admin") {
    ctx.response.status = 403;
    return (ctx.response.body = {
      message: "User not authorized.",
    });
  }

  const id = ctx.request.url.pathname.split("/")[3];
  const validationError = idCheck(id);
  if (validationError) {
    ctx.response.status = 400;
    return (ctx.response.body = { message: validationError });
  }

  await next();
};

export {
  createUserMiddleware,
  deleteUserMiddleware,
  getUserMiddleware,
  getUsersMiddleware,
  updatePasswordMiddleware,
  updateUserMiddleware,
};
