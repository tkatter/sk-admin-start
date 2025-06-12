import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "~/routeTree.gen";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { log } from "./lib/utils";

const queryClient = new QueryClient();

export function createRouter() {
  const router = createTanStackRouter({
    context: {
      queryClient,
    },
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    // TODO: MAKE GLOBAL ERROR COMPONENT FOR UNAUTHORIZED ACCESS
    defaultErrorComponent: LoadingSpinner,
    // TODO: MAKE GLOBAL NOT FOUND COMPONENT
    defaultNotFoundComponent: GlobalNotFound,
    // TODO: MAKE GLOBAL PENDING COMPONENT
    defaultPendingComponent: LoadingSpinner,
  });

  log("Router created with routeTree");
  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

function GlobalNotFound() {
  return (
    <div className="w-full flex items-center justify-center">
      <h1 className="text-7xl font-bold">Page Not Found</h1>
    </div>
  );
}
