import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AppLayout from "~/components/AppLayout";
import LoadingSpinner from "~/components/ui/LoadingSpinner";

export const Route = createFileRoute("/(app)")({
  beforeLoad: async ({ context }) => {
    if (!context.userSession) throw redirect({ to: "/sign-in" });
  },
  // TODO: MAKE GLOBAL ERROR COMPONENT FOR UNAUTHORIZED ACCESS
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
