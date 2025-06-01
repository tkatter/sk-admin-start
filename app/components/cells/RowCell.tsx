import type { CellContext } from "@tanstack/react-table";
import type { ScheduleItem } from "~/lib/types/schedule-types";

import { format } from "date-fns";

export interface RowCellProps<T> extends CellContext<ScheduleItem, T> {
  isDate?: boolean;
}

function RowCell<T>(props: RowCellProps<T>) {
  let rowValue = props.getValue<string | Date>();
  rowValue instanceof Date
    ? (rowValue = format(rowValue, "MMMM do, yyyy"))
    : (rowValue = rowValue);

  return (
    <div
      className={`w-full ${
        props.isDate ? "px-4 text-sm" : "px-2"
      } flex items-center justify-center`}
    >
      <p className="min-w-max">{rowValue}</p>
    </div>
  );
}

export default RowCell;
