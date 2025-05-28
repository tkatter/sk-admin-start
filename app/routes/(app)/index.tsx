import {
  createFileRoute,
  redirect,
  useLoaderData,
} from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/")({
  beforeLoad: async ({ context }) => {
    // if (!context.userSession) throw redirect({ to: "/sign-in" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/"!</div>;
}
