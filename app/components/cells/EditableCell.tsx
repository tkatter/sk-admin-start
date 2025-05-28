import { useRef, useState } from "react";
import type { Column, Getter, Row } from "@tanstack/react-table";
import type { FormattedScheduleItems } from "~/lib/types/schedule-types";
import { Input } from "~/components/ui/input";
import { useSchedule } from "~/context/ScheduleContext";

export default function EditableCell({
  getValue,
  column,
  row,
}: {
  getValue: Getter<string>;
  column: Column<FormattedScheduleItems, string>;
  row: Row<FormattedScheduleItems>;
}) {
  const { updateDbFromLocal } = useSchedule();
  const inputRef = useRef<HTMLInputElement>(null);
  const initialValue = getValue();
  const [value, setValue] = useState<string>(initialValue);

  const handleOnSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const columnId = column.id;
      const itemId = row.id;
      if (inputRef.current) inputRef.current.blur();

      updateDbFromLocal(itemId, columnId, e.currentTarget.value);
    }
  };

  return (
    <div className="px-2">
      <Input
        className="border-none block cursor-cell text-left capitalize w-full"
        value={value}
        ref={inputRef}
        type="text"
        onKeyDown={(e) => handleOnSubmit(e)}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
