import { useQuery } from "@tanstack/react-query";
import { createAuthClient } from "better-auth/react";
import { authQueries } from "~/lib/queries";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
});

/**
 * Hook to check if the user is authenticated.
 *
 * @returns Object containing the user session if there is one, and a boolean isAuthenticated
 */
export const useAuthentication = () => {
  const { data: userSession } = useQuery(authQueries.user());

  return { userSession, isAuthenticated: !!userSession };
};
