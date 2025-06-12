import { Filter as FilterIcon, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useSchedule } from "~/context/ScheduleContext";
import { EventType, Status } from "~/lib/types/schedule-types";

const statusOpts: Status[] = [
  "pending",
  "in-progress",
  "confirmed",
  "cancelled",
  "completed",
];

const eventOpts: EventType[] = ["job", "appointment", "event", "meeting"];

export function FilterInput() {
  const { columnFilters, dispatch } = useSchedule();
  const itemName =
    columnFilters.find((filter) => filter.id === "name")?.value || "";

  const onFilterChange = (id: string, value: string) =>
    dispatch({ type: "filterChange", payload: { id, value } });

  return (
    <div className="flex items-center">
      <Input
        className="bg-slate-800/40 min-w-20 max-w-2xs"
        value={itemName}
        onChange={(e) => onFilterChange("name", e.target.value)}
        placeholder="Filter items"
      />
    </div>
  );
}

export function FilterPopover() {
  const { columnFilters, dispatch } = useSchedule();
  const statusValue =
    columnFilters.find((filter) => filter.id === "status")?.value || "";
  const eventValue =
    columnFilters.find((filter) => filter.id === "eventType")?.value || "";

  const onFilterChange = (id: string, value: string) =>
    dispatch({ type: "filterChange", payload: { id, value } });

  const handleClearFilters = () => {
    dispatch({ type: "clearFilters", payload: "status" });
    dispatch({ type: "clearFilters", payload: "eventType" });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center">
          <FilterIcon />
          <p className="max-sm:hidden">Filter</p>
        </Button>
      </PopoverTrigger>
      {(statusValue || eventValue) && (
        <Button
          variant={"ghost"}
          className="hover:bg-slate-800/80"
          onClick={handleClearFilters}
        >
          <X />
        </Button>
      )}
      <PopoverContent className="shadow-lg">
        <div className="grid grid-cols-2 items-center text-base gap-y-2">
          <p>Status</p>
          <div className="">
            <Select
              value={statusValue}
              onValueChange={(e) => onFilterChange("status", e)}
            >
              <SelectTrigger className="cursor-pointer w-full">
                <SelectValue placeholder="Status" className="" />
              </SelectTrigger>
              <SelectContent>
                {statusOpts.map((el) => (
                  <SelectItem value={el} key={el} className="cursor-pointer">
                    <p className="capitalize">{el}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p>Event</p>
          <div className="">
            <Select
              value={eventValue}
              onValueChange={(e) => onFilterChange("eventType", e)}
            >
              <SelectTrigger className="cursor-pointer w-full">
                <SelectValue placeholder="Event" className="" />
              </SelectTrigger>
              <SelectContent>
                {eventOpts.map((el) => (
                  <SelectItem value={el} key={el} className="cursor-pointer">
                    <p className="capitalize">{el}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
