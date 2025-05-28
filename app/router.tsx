import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "~/routeTree.gen";

const queryClient = new QueryClient();

export function createRouter() {
  const router = createTanStackRouter({
    context: {
      queryClient,
    },
    routeTree,
    scrollRestoration: true,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
