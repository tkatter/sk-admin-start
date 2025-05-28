import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Column, Getter, Row } from "@tanstack/react-table";
import type {
  FormattedScheduleItems,
  Status,
} from "~/lib/types/schedule-types";
import { useSchedule } from "~/context/ScheduleContext";

interface DropDownCellProps {
  getValue: Getter<Status>;
  row: Row<FormattedScheduleItems>;
  column: Column<FormattedScheduleItems, Status>;
}

export default function DropDownCell({
  getValue,
  row,
  column,
}: DropDownCellProps) {
  const { updateDbFromLocal } = useSchedule();
  const initialValue = getValue();
  const [value, setValue] = useState<string>(initialValue);

  const onChange = (e: string) => {
    setValue(e);
    updateDbFromLocal(row.id, column.id, e);
  };

  return (
    <div className="px-2">
      <Select value={value} onValueChange={(e) => onChange(e)}>
        <SelectTrigger className="cursor-pointer w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="in-progress">In-progress</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
