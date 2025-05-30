import { createFileRoute } from "@tanstack/react-router";
import { scheduleQueries } from "~/lib/queries";
import SchedulePage from "~/routes/(app)/schedule/-pages/SchedulePage";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import { ScheduleProvider } from "~/context/ScheduleContext";

export const Route = createFileRoute("/(app)/schedule/")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(scheduleQueries.getAllScheduleItemsOpts());
  },

  pendingComponent: LoadingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ScheduleProvider>
      <SchedulePage />
    </ScheduleProvider>
  );
}
