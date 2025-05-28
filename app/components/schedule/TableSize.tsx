import { useState } from "react";
import type { ScheduleTableProps } from "~/components/schedule/ScheduleTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

function TableSize({ table }: ScheduleTableProps) {
  const [size, setSize] = useState("");

  function handleSizeChange(v: string) {
    setSize(v);
    table.setPageSize(Number(v));
  }

  return (
    <Select value={size} onValueChange={(v) => handleSizeChange(v)}>
      <SelectTrigger className="bg-slate-800/40">
        <SelectValue placeholder="Size" />
      </SelectTrigger>
      <SelectContent align="end" side="bottom">
        <SelectItem value="5">5</SelectItem>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="15">15</SelectItem>
        <SelectItem value="20">20</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default TableSize;
