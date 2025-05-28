import { createFileRoute } from "@tanstack/react-router";
import SignUpPage from "./-components/SignUpPage";

export const Route = createFileRoute("/(auth)/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignUpPage />;
}
