import { Session } from "https://deno.land/x/oak_sessions@v4.1.9/mod.ts";
type AppState = {
  session: Session;
};

export default AppState;
