import { createFileRoute } from "@tanstack/react-router";
// import { RadarDash } from "~/components/dashboard/Radar";
// import { LineDash } from "~/components/dashboard/LineChart";
// import LogoutButton from "~/components/LogoutButton";

export const Route = createFileRoute("/(app)/")({
  component: Home,
});

function Home() {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-muted/50">{/* <RadarDash /> */}</div>
        <div className="rounded-xl bg-muted/50">{/* <LineDash /> */}</div>
        <div className="rounded-xl bg-muted/50" />
        <div className="rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </>
  );
}
