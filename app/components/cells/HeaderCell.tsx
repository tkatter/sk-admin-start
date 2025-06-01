import type { HeaderContext } from "@tanstack/react-table";
import type { ScheduleItem } from "~/lib/types/schedule-types";

import { ArrowDownUp, EyeOff, SortAsc, SortDesc } from "lucide-react";
import { useSchedule } from "~/context/ScheduleContext";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";

export interface HeaderCellProps<T> extends HeaderContext<ScheduleItem, T> {
  headerValue: string;
}
function HeaderCell<T>(props: HeaderCellProps<T>) {
  const { dispatch } = useSchedule();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="w-full h-full px-2 flex items-center justify-center cursor-default">
          <p>{props.headerValue}</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {props.header.column.getCanSort() && (
          <>
            <ContextMenuRadioGroup
              value={`${props.header.column.getIsSorted() || "none"}`}
            >
              <ContextMenuLabel>Sort</ContextMenuLabel>
              <ContextMenuRadioItem
                value="asc"
                onClick={() => props.header.column.toggleSorting(false)}
                className="cursor-pointer"
              >
                Ascending
              </ContextMenuRadioItem>
              <ContextMenuRadioItem
                value="desc"
                onClick={() => props.header.column.toggleSorting(true)}
                className="cursor-pointer"
              >
                Descending
              </ContextMenuRadioItem>
              <ContextMenuRadioItem
                value="none"
                onClick={() => props.header.column.clearSorting()}
                className="cursor-pointer"
              >
                None
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>

            <ContextMenuSeparator />
          </>
        )}

        <ContextMenuItem
          className="cursor-pointer font-medium"
          onClick={() => {
            dispatch({ type: "hidden", payload: null });
            return props.column.toggleVisibility(!props.column.getIsVisible());
          }}
        >
          Hide
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function HeaderCellV1<T>(props: HeaderCellProps<T>) {
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
