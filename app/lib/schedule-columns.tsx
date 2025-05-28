import { createColumnHelper } from "@tanstack/react-table";
import type { CheckedState } from "@radix-ui/react-checkbox";
import type { Row, Table } from "@tanstack/react-table";
import type {
  FormattedScheduleItems,
  Status,
} from "~/lib/types/schedule-types";
import type { Location } from "~/lib/utils";
import type { HeaderCellProps } from "~/components/cells/HeaderCell";
import DatePickerCell from "~/components/cells/DatePickerCell";
import DropDownCell from "~/components/cells/DropDownCell";
import EditableCell from "~/components/cells/EditableCell";
import { Checkbox } from "~/components/ui/checkbox";
import HeaderCell from "~/components/cells/HeaderCell";
import { formatLocation } from "~/lib/utils";

const columnHelper = createColumnHelper<FormattedScheduleItems>();

export const columns = [
  {
    id: "select-col",
    header: ({ table }: { table: Table<FormattedScheduleItems> }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          className="size-5 p-0 m-0"
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(e: CheckedState) => {
            if (e === "indeterminate") return;
            table.toggleAllRowsSelected(e);
          }}
        />
      </div>
    ),
    cell: ({ row }: { row: Row<FormattedScheduleItems> }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          className="size-5 p-0 m-0 "
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={row.getToggleSelectedHandler()}
        />
      </div>
    ),
    // enableResizing: false,
    size: 30,
  },
  columnHelper.accessor("id", {
    header: (props) => {
      const newProps: HeaderCellProps<string> = { ...props, headerValue: "ID" };
      return HeaderCell<string>(newProps);
    },
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor("name", {
    header: (props) => {
      const newProps: HeaderCellProps<string> = {
        ...props,
        headerValue: "Name",
      };
      return HeaderCell<string>(newProps);
    },
    cell: EditableCell,
    enableColumnFilter: true,
    filterFn: "includesString",
    enableSorting: false,
  }),
  columnHelper.accessor("startDate", {
    header: (props) => {
      const newProps: HeaderCellProps<Date> = {
        ...props,
        headerValue: "Start",
      };
      return HeaderCell<Date>(newProps);
    },
    cell: DatePickerCell,
  }),
  columnHelper.accessor("endDate", {
    header: (props) => {
      const newProps: HeaderCellProps<Date> = {
        ...props,
        headerValue: "End",
      };
      return HeaderCell<Date>(newProps);
    },
    cell: DatePickerCell,
  }),
  columnHelper.accessor("status", {
    header: (props) => {
      const newProps: HeaderCellProps<Status> = {
        ...props,
        headerValue: "Status",
      };
      return HeaderCell<Status>(newProps);
    },
    cell: DropDownCell,
    enableColumnFilter: true,
    filterFn: "equalsString",
    enableSorting: false,
  }),
  // columnHelper.accessor('location', {
  //   header: (props) => {
  //     const newProps: HeaderCellProps<Location> = {
  //       ...props,
  //       headerValue: 'Location',
  //     }
  //     return HeaderCell<Location>(newProps)
  //   },
  //   cell: (props) => (
  //     <div className="px-2 capitalize">
  //       <p>{`${props.getValue().address} ${props.getValue().city} ${props.getValue().state}, ${props.getValue().zip}`}</p>
  //     </div>
  //   ),
  //   enableSorting: false,
  // }),
  columnHelper.accessor((row) => formatLocation(row.location), {
    id: "location",
    header: "Location",
    cell: (info) => {
      const location = info.row.original.location;
      return (
        <div className="max-w-xs">
          <div className="truncate">{formatLocation(location)}</div>
          {/* Optional: Show individual parts on hover */}
          {location && (
            <div className="text-xs text-muted-foreground">
              {location.city}, {location.state}
            </div>
          )}
        </div>
      );
    },
    filterFn: "includesString",
  }),
  columnHelper.accessor((row) => row.location?.city, {
    id: "city",
    header: "City",
    // Hide this column but make it available for filtering
    enableHiding: true,
    meta: { hidden: true },
  }),
];
