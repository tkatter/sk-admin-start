import type {
  EventType,
  Location,
  ScheduleItem,
  Status,
} from "~/lib/types/schedule-types";
import type { HeaderCellProps } from "~/components/cells/HeaderCell";

import { Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import HeaderCell from "~/components/cells/HeaderCell";
import RowCell from "~/components/cells/RowCell";
import { Badge } from "~/components/ui/badge";
import { getMapsUrl } from "~/lib/utils";

const columnHelper = createColumnHelper<ScheduleItem>();

export const columns = [
  columnHelper.accessor("id", {
    header: (props) => {
      const newProps: HeaderCellProps<number> = { ...props, headerValue: "ID" };
      return HeaderCell<number>(newProps);
    },
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
    cell: RowCell,
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
    cell: (props) => {
      const newProps = {
        ...props,
        isDate: true,
      };
      return RowCell(newProps);
    },
  }),
  columnHelper.accessor("endDate", {
    header: (props) => {
      const newProps: HeaderCellProps<Date> = {
        ...props,
        headerValue: "End",
      };
      return HeaderCell<Date>(newProps);
    },
    cell: (props) => {
      const newProps = {
        ...props,
        isDate: true,
      };
      return RowCell(newProps);
    },
  }),
  columnHelper.accessor("status", {
    header: (props) => {
      const newProps: HeaderCellProps<Status> = {
        ...props,
        headerValue: "Status",
      };
      return HeaderCell<Status>(newProps);
    },
    cell: (props) => (
      <div className="px-2 flex items-center justify-center capitalize">
        <Badge>{props.getValue()}</Badge>
      </div>
    ),
    enableColumnFilter: true,
    filterFn: "equalsString",
    enableSorting: false,
  }),
  columnHelper.accessor("eventType", {
    header: (props) => {
      const newProps: HeaderCellProps<EventType> = {
        ...props,
        headerValue: "Type",
      };
      return HeaderCell<EventType>(newProps);
    },
    cell: (props) => (
      <div className="px-2 flex items-center justify-center capitalize">
        <Badge>{props.getValue()}</Badge>
      </div>
    ),
    enableColumnFilter: true,
    filterFn: "equalsString",
    enableSorting: false,
  }),
  columnHelper.accessor("location", {
    header: (props) => {
      const newProps: HeaderCellProps<Location | null> = {
        ...props,
        headerValue: "Location",
      };
      return HeaderCell<Location | null>(newProps);
    },
    cell: (props) => {
      const hasLocation = props.row.getValue("hasLocation");
      const location = props.getValue();
      if (!hasLocation || location === null) return null;
      const [mapsUrl] = getMapsUrl(location);

      return (
        <div className="px-2 w-full flex items-center justify-center text-sm">
          <Link to={mapsUrl.toString()} target="_blank">
            <p className="capitalize">{`${location.address} ${location.city}, ${location.state} ${location.zip}`}</p>
          </Link>
        </div>
      );
    },
    // filterFn: (row, columnId, filterValue) =>
    //   !filterValue
    //     ? true
    //     : row.getValue<Location>(columnId) === null
    //     ? false
    //     : Object.values(row.getValue<Location>(columnId)).some((el) =>
    //         el.toLowerCase().includes(filterValue)
    //       ),

    enableColumnFilter: true,
    enableSorting: false,
  }),
  columnHelper.accessor("hasLocation", {
    header: (props) => {
      const newProps: HeaderCellProps<boolean> = {
        ...props,
        headerValue: "hasLocation",
      };
      return HeaderCell<boolean>(newProps);
    },
    cell: (props) => <p>{props.getValue()}</p>,
    enableHiding: true,
    meta: { hidden: true },
  }),
];
