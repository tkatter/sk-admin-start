import { ArrowDownUp, EyeOff, SortAsc, SortDesc } from "lucide-react";
import type { HeaderContext } from "@tanstack/react-table";
import type { FormattedScheduleItems } from "~/lib/types/schedule-types";
import { useSchedule } from "~/context/ScheduleContext";

export interface HeaderCellProps<T>
  extends HeaderContext<FormattedScheduleItems, T> {
  headerValue: string;
}

function HeaderCell<T>(props: HeaderCellProps<T>) {
  const { dispatch } = useSchedule();
  return (
    <div className="relative ml-2 flex items-center justify-between">
      <p>{props.headerValue}</p>
      <div
        onMouseDown={props.header.getResizeHandler()}
        onTouchStart={props.header.getResizeHandler()}
        className={`cell-resizer ${
          props.header.column.getIsResizing() ? "is-resizing" : ""
        }`}
      />
      <div className="flex">
        {props.header.column.getCanSort() &&
          (!props.header.column.getIsSorted() ? (
            <ArrowDownUp
              size={18}
              className="mr-2 cursor-pointer"
              onClick={props.header.column.getToggleSortingHandler()}
            />
          ) : props.header.column.getIsSorted() === "asc" ? (
            <SortAsc
              size={18}
              className="mr-2 cursor-pointer"
              onClick={props.header.column.getToggleSortingHandler()}
            />
          ) : (
            <SortDesc
              size={18}
              className="mr-2 cursor-pointer"
              onClick={props.header.column.getToggleSortingHandler()}
            />
          ))}

        {props.header.column.getCanHide() && (
          <EyeOff
            size={18}
            className="mr-2 cursor-pointer"
            onClick={() => {
              dispatch({ type: "hidden", payload: null });
              return props.column.toggleVisibility(
                !props.column.getIsVisible()
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

export default HeaderCell;
