import type { Table as TableType } from "@tanstack/react-table";
import type { ScheduleItem } from "~/lib/types/schedule-types";

import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useSchedule } from "~/context/ScheduleContext";
import { columns } from "~/lib/schedule-columns";

/**
 * Props interface for the ScheduleTable component
 * @interface ScheduleTableProps
 */
export interface ScheduleTableProps {
  /** TanStack table instance for managing schedule items */
  table: TableType<ScheduleItem>;
}

/**
 * Renders a data table for schedule items with support for sorting, filtering and pagination
 * @param {ScheduleTableProps} props - The component props
 * @returns The rendered table component
 */
function ScheduleTable({ table }: ScheduleTableProps) {
  const { data } = useSchedule();
  return (
    <div className="border-2 rounded-lg bg-slate-900/40 shadow-lg">
      <Table
        className={`overflow-hidden rounded-md`}
        width={table.getTotalSize()}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={`border-r-1 text-slate-300 text-lg w-[${header.getSize()}]`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    width={cell.column.getSize()}
                    className={`border-r-1 text-slate-200 text-base px-0`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ScheduleTable;
