import { createFileRoute } from "@tanstack/react-router";
import SignInPage from "./-components/SignInPage";

export const Route = createFileRoute("/(auth)/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignInPage />;
}
