import { hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { compare } from "https://deno.land/x/bcrypt@v0.4.1/src/main.ts";
import { Context } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import database from "../database/connection.ts";
import { UserResponse } from "../schemas/user.schema.ts";
import validateUser from "../validations/user.validation.ts";

const createUserHandler = async (ctx: Context) => {
  const { username, email, password } = await ctx.request.body().value;
  const hashedPassword = await hash(password);

  let user: UserResponse;

  try {
    user = database.queryEntries<UserResponse>(
      `INSERT INTO users (username, email, password, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?) RETURNING id, username, email, role, createdAt, updatedAt`,
      [username, email, hashedPassword, new Date(), new Date()]
    )[0];
  } catch (err) {
    if (err.message.includes("email")) {
      ctx.response.status = 400;
      return (ctx.response.body = {
        message: "Email already exists.",
      });
    }
    if (err.message.includes("username")) {
      ctx.response.status = 400;
      return (ctx.response.body = {
        message: "Username already exists.",
      });
    }
    ctx.response.status = 500;
    return (ctx.response.body = {
      message: "Something went wrong.",
    });
  }

  ctx.response.status = 201;
  return (ctx.response.body = {
    message: "User created.",
    user: user,
  });
};

const getUsersHandler = async (ctx: Context) => {
  let users: Array<UserResponse>;

  try {
    users = database.queryEntries<UserResponse>(
      `SELECT id, username, email, role, createdAt, updatedAt FROM users`
    );
  } catch (err) {
    ctx.response.status = 500;
    return (ctx.response.body = {
      message: "Something went wrong.",
    });
  }

  ctx.response.status = 200;
  return (ctx.response.body = users);
};

const getUserHandler = async (ctx: Context) => {
  const id = parseInt(ctx.request.url.pathname.split("/")[3]);

  let user: UserResponse;

  try {
    user = database.queryEntries<UserResponse>(
      `SELECT id, username, email, role, createdAt, updatedAt FROM users WHERE id = ?`,
      [id]
    )[0];
  } catch (err) {
    ctx.response.status = 400;
    return (ctx.response.body = {
      message: "User not found.",
    });
  }

  ctx.response.status = 200;
  return (ctx.response.body = user);
};

const updateUserHandler = async (ctx: Context) => {
  const id = parseInt(ctx.request.url.pathname.split("/")[3]);

  let { username, email } = await ctx.request.body().value;

  const validationError = validateUser(username, email);
  if (validationError) {
    ctx.response.status = 400;
    return (ctx.response.body = { message: validationError });
  }

  try {
    database.query(
      `UPDATE users SET username = ?, email = ?, updatedAt = ? WHERE id = ?`,
      [username, email, new Date(), id]
    );
  } catch (err) {
    if (err.message.includes("email")) {
      ctx.response.status = 400;
      return (ctx.response.body = {
        message: "Email already exists.",
      });
    }
    if (err.message.includes("username")) {
      ctx.response.status = 400;
      return (ctx.response.body = {
        message: "Username already exists.",
      });
    }
    ctx.response.status = 500;
    return (ctx.response.body = {
      message: "Something went wrong.",
    });
  }

  ctx.response.status = 200;
  return (ctx.response.body = { message: "User updated." });
};

const updatePasswordHandler = async (ctx: Context) => {
  const id = parseInt(ctx.request.url.pathname.split("/")[3]);

  const { password, newPassword } = await ctx.request.body().value;

  try {
    const hashedPassword = database.queryEntries<{ password: string }>(
      `SELECT password FROM users WHERE id = ?`,
      [id]
    )[0].password;

    const passwordMatch = await compare(password, hashedPassword);
    if (!passwordMatch) {
      ctx.response.status = 400;
      return (ctx.response.body = { message: "Invalid password." });
    }
  } catch (err) {
    ctx.response.status = 500;
    return (ctx.response.body = {
      message: "Something went wrong.",
    });
  }

  const hashedPassword = await hash(newPassword);

  try {
    database.query(
      `UPDATE users SET password = ?, updatedAt = ? WHERE id = ?`,
      [hashedPassword, new Date(), id]
    );
  } catch (err) {
    ctx.response.status = 500;
    return (ctx.response.body = {
      message: "Something went wrong.",
    });
  }

  ctx.response.status = 200;
  return (ctx.response.body = { message: "Password updated succesfully." });
};

const deleteUserHandler = async (ctx: Context) => {
  const id = parseInt(ctx.request.url.pathname.split("/")[3]);

  try {
    database.query(`DELETE FROM users WHERE id = ?`, [id]);
  } catch (err) {
    ctx.response.status = 500;
    return (ctx.response.body = {
      message: "Something went wrong.",
    });
  }

  if (id === ctx.state.session.get("id")) {
    ctx.state.session.deleteSession();
  }

  ctx.response.status = 200;
  return (ctx.response.body = { message: "User deleted." });
};

export {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  getUsersHandler,
  updatePasswordHandler,
  updateUserHandler,
};
