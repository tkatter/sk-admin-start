import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AppLayout from "~/components/AppLayout";

export const Route = createFileRoute("/(app)")({
  beforeLoad: async ({ context }) => {
    if (!context.userSession) throw redirect({ to: "/sign-in" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
