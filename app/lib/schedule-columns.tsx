import type { CheckedState } from "@radix-ui/react-checkbox";
import type { Row, Table } from "@tanstack/react-table";
import type { ScheduleItem, Status } from "~/lib/types/schedule-types";
import type { HeaderCellProps } from "~/components/cells/HeaderCell";

import { Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import DatePickerCell from "~/components/cells/DatePickerCell";
import EditableCell from "~/components/cells/EditableCell";
import HeaderCell from "~/components/cells/HeaderCell";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { formatLocation, getMapsUrl } from "~/lib/utils";

const columnHelper = createColumnHelper<ScheduleItem>();

export const columns = [
  {
    id: "select-col",
    header: ({ table }: { table: Table<ScheduleItem> }) => (
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
    cell: ({ row }: { row: Row<ScheduleItem> }) => (
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
    // header: (props) => {
    //   const newProps: HeaderCellProps<string> = { ...props, headerValue: "ID" };
    //   return HeaderCell<string>(newProps);
    // },
    cell: (props) => <p>{props.getValue()}</p>,
    enableHiding: true,
    meta: { hidden: true },
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
    // cell: DropDownCell,
    cell: (props) => (
      <div className="flex items-center justify-center capitalize">
        <Badge>{props.getValue()}</Badge>
      </div>
    ),
    enableColumnFilter: true,
    filterFn: "equalsString",
    enableSorting: false,
  }),
  columnHelper.accessor((row) => formatLocation(row.location), {
    id: "location",
    header: "Location",
    cell: (props) => {
      const location = props.row.original.location;
      if (!location)
        return (
          <div className="px-4">
            <div>{formatLocation(location)}</div>
          </div>
        );

      const [mapsUrl, formattedAddress] = getMapsUrl(location);

      return (
        <div className="px-4">
          <Link to={mapsUrl.toString()} target="_blank" className="capitalize">
            {formattedAddress}
          </Link>
        </div>
      );
    },
    filterFn: "includesString",
    enableColumnFilter: true,
  }),
];
