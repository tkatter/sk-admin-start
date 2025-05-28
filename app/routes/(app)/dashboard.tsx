import { createFileRoute, redirect } from "@tanstack/react-router";
import LogoutButton from "~/components/LogoutButton";

export const Route = createFileRoute("/(app)/dashboard")({
  beforeLoad: async ({ context }) => {
    if (!context.userSession) throw redirect({ to: "/sign-in" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div>Hello "/(app)/dashboard"!</div>
      <LogoutButton />
    </>
  );
}
