import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Column, Getter, Row } from "@tanstack/react-table";
import type { ScheduleItem } from "~/lib/types/schedule-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";
import { useSchedule } from "~/context/ScheduleContext";

interface DatePickerCellProps {
  getValue: Getter<Date>;
  row: Row<ScheduleItem>;
  column: Column<ScheduleItem, Date>;
}

export default function DatePickerCell({
  getValue,
  row,
  column,
}: DatePickerCellProps) {
  const { updateDbFromLocal } = useSchedule();
  const initialValue = getValue();
  const [date, setDate] = useState<Date | undefined>(initialValue);

  const onChange = (value: Date | undefined) => {
    if (!value) return toast.error(`Couldn't select date, try again`);
    setDate(value);
    const itemId = row.id;
    const columnId = column.id;
    const formattedValue = value.toISOString();
    updateDbFromLocal(itemId, columnId, formattedValue);
  };

  return (
    <div className="px-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "w-full justify-start text-left font-normal cursor-pointer",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date ? format(date, "PPP") : <p>Select a Date</p>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            selected={date}
            onSelect={(value) => onChange(value)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
