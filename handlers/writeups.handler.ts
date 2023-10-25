import { existsSync } from "https://deno.land/std@0.132.0/node/_fs/_fs_exists.ts";
import { RouterContext } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import database from "../database/connection.ts";
import Writeup from "../schemas/writeup.schema.ts";

type RCTX = RouterContext<string>;

const getWriteupsHandler = async (ctx: RCTX) => {
  let writeups: Array<Writeup>;

  try {
    writeups = database.queryEntries<Writeup>("SELECT * FROM writeups");
  } catch (err) {
    ctx.response.status = 500;
    return (ctx.response.body = {
      message: "Writeups couldn't be fetched.",
    });
  }

  ctx.response.status = 200;
  return (ctx.response.body = writeups);
};

const getWriteupHandler = async (ctx: RCTX) => {
  const id = ctx.params.id;
  console.log(id);

  let writeup: Writeup;

  try {
    [writeup] = database.queryEntries<Writeup>("SELECT * FROM writeups WHERE ");
  } catch (err) {
    ctx.response.status = 500;
    return (ctx.response.body = {
      message: "Writeups couldn't be fetched.",
    });
  }

  ctx.response.status = 200;
  return (ctx.response.body = writeup);
};

const createWriteupHandler = async (ctx: RCTX) => {
  const session = await ctx.state.session;
  const username = session.get("username");
  // const uid = session.get("id");

  const body = ctx.request.body({
    type: "form-data",
  }).value;

  const uploaded = await body.read({ maxSize: 10_000_000 });
  const file = uploaded.files?.find((f) => {
    if (f.name === "content") return f;
  });

  if (!file?.content) {
    ctx.response.status = 400;
    return (ctx.response.body = {
      message: "File could not be processed.",
    });
  }

  const title = uploaded.fields["title"];
  const pathDir = "./content/" + username;
  const pathFile = pathDir + "/" + title + ".md";
  if (!existsSync(pathDir)) Deno.mkdirSync(pathDir);
  Deno.writeFileSync(pathFile, file.content);
  ctx.response.status = 200;
  return (ctx.response.body = {
    message: "File successfully created!",
  });
};

export { createWriteupHandler, getWriteupHandler, getWriteupsHandler };
