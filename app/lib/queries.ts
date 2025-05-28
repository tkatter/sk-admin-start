import { queryOptions } from "@tanstack/react-query";
import { getUserSession } from "~/lib/serverFns/auth.api";

export const authQueries = {
  all: ["auth"],
  user: () =>
    queryOptions({
      queryKey: [...authQueries.all, "user"],
      queryFn: () => getUserSession(),
    }),
};
