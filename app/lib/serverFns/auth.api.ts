import { createMiddleware, createServerFn, json } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth";
import { log } from "../utils";

export const getUserSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();

    if (!request?.headers) {
      return null;
    }

    const userSession = await auth.api.getSession({ headers: request.headers });

    return userSession;
  }
);

// MIDDLEWARE
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const req = getWebRequest();

  if (!req || !req.headers) {
    throw json({ message: "Invalid request" }, { status: 400 });
  }

  const userSession = await auth.api.getSession({
    headers: req.headers,
  });

  if (!userSession)
    throw json({ message: "Unauthorized access" }, { status: 401 });

  log("Global middleware -- REMOVE ME LATER");
  const { session, user } = userSession;
  return next({
    context: {
      user,
      session,
    },
  });
});
