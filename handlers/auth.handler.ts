import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Context } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import database from "../database/connection.ts";
import { emailCheck, passwordCheck } from "../validations/user.validation.ts";

const sessionHandler = async (ctx: Context) => {
  const session = await ctx.state.session;
  const auth = await session.get("authenticated");
  if (!auth) {
    ctx.response.status = 403;
    return (ctx.response.body = {
      message: "User not logged in.",
      authenticated: false,
    });
  }

  const role = await session.get("role");
  ctx.response.status = 200;
  return (ctx.response.body = {
    message: "User logged in.",
    authenticated: true,
    session: {
      id: session.get("id"),
      username: session.get("username"),
      role: role,
      authenticated: auth,
    },
  });
};

const loginHandler = async (ctx: Context) => {
  const cookie = await ctx.state.session.get("authenticated");
  if (cookie) {
    ctx.response.status = 403;
    return (ctx.response.body = {
      authenticated: true,
      message: "User already logged in.",
    });
  }

  const { email, password } = await ctx.request.body().value;

  const emailError = emailCheck(email);
  if (emailError) {
    ctx.response.status = 400;
    return (ctx.response.body = {
      authenticated: false,
      message: emailError,
    });
  }

  const passwordError = passwordCheck(password);
  if (passwordError) {
    ctx.response.status = 400;
    return (ctx.response.body = {
      authenticated: false,
      message: passwordError,
    });
  }

  type Login = {
    id: number;
    username: string;
    role: string;
    password: string;
  };

  let user: Login;

  try {
    user = database.queryEntries<Login>(
      "SELECT id, username, role, password FROM users WHERE email = ?",
      [email]
    )[0];

    if (!user) {
      ctx.response.status = 400;
      return (ctx.response.body = {
        authenticated: false,
        message: "Email or password is incorrect.",
      });
    }

    const passwordHash = user.password;
    if (!passwordHash) {
      ctx.response.status = 400;
      return (ctx.response.body = {
        authenticated: false,
        message: "Email or password is incorrect.",
      });
    }

    const passwordMatch = await compare(password, passwordHash);
    if (!passwordMatch) {
      ctx.response.status = 400;
      return (ctx.response.body = {
        authenticated: false,
        message: "Incorrect password.",
      });
    }
  } catch (err) {
    console.error("%c" + err.message, "color: red;");
    ctx.response.status = 500;
    return (ctx.response.body = {
      authenticated: false,
      message: "User could not be found.",
    });
  }

  ctx.state.session.set("id", user.id);
  ctx.state.session.set("username", user.username);
  ctx.state.session.set("authenticated", true);
  ctx.state.session.set("role", user.role);
  ctx.response.status = 200;
  return (ctx.response.body = {
    authenticated: true,
    message: "User logged in.",
  });
};

const logoutHandler = async (ctx: Context) => {
  const cookie = await ctx.state.session.get("authenticated");
  if (!cookie) {
    ctx.response.status = 403;
    return (ctx.response.body = {
      authenticated: false,
      message: "User not logged in.",
    });
  }

  ctx.state.session.deleteSession();
  ctx.cookies.delete("session");
  ctx.cookies.delete("session_data");
  ctx.response.status = 200;
  return (ctx.response.body = {
    authenticated: false,
    message: "User logged out.",
  });
};

const forgotPasswordHandler = async (ctx: Context) => {
  ctx.response.status = 501;
  return (ctx.response.body = { message: "Not implemented." });
};

export { forgotPasswordHandler, loginHandler, logoutHandler, sessionHandler };
