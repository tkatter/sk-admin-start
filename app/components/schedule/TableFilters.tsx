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

export function FilterInput() {
  const { columnFilters, dispatch } = useSchedule();
  const itemName =
    columnFilters.find((filter) => filter.id === "name")?.value || "";

  const onFilterChange = (id: string, value: string) =>
    dispatch({ type: "filterChange", payload: { id, value } });

  return (
    <div className="">
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
  const optValue =
    columnFilters.find((filter) => filter.id === "status")?.value || "";

  const onFilterChange = (id: string, value: string) =>
    dispatch({ type: "filterChange", payload: { id, value } });

  const handleClearFilters = () => {
    dispatch({ type: "clearFilters", payload: "status" });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center">
          <FilterIcon />
          <p className="max-sm:hidden">Filter</p>
        </Button>
      </PopoverTrigger>
      {optValue && (
        <Button
          variant={"ghost"}
          className="hover:bg-slate-800/80"
          onClick={handleClearFilters}
        >
          <X />
        </Button>
      )}
      <PopoverContent className="shadow-lg">
        <div className="grid grid-cols-2 items-center text-base ">
          <p>Status</p>
          <div className="">
            <Select
              value={optValue}
              onValueChange={(e) => onFilterChange("status", e)}
            >
              <SelectTrigger className="cursor-pointer w-full">
                <SelectValue placeholder="Status" className="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending" className="cursor-pointer">
                  Pending
                </SelectItem>
                <SelectItem value="confirmed" className="cursor-pointer">
                  Confirmed
                </SelectItem>
                <SelectItem value="in-progress" className="cursor-pointer">
                  In-progress
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
