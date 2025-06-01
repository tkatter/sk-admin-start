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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteScheduleItem } from "~/lib/serverFns/schedule.api";
import { LoadingSpinnerMini } from "~/components/ui/LoadingSpinner";
import { log } from "~/lib/utils";

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
  const queryClient = useQueryClient();
  const alertRef = useRef<HTMLButtonElement>(null);
  const actionBtnRef = useRef<HTMLButtonElement>(null);
  const [deleteItem, setDeleteItem] = useState<ScheduleItem["id"] | null>(null);
  const deleteEvent = useServerFn(deleteScheduleItem);

  const {
    data: mutationData,
    mutate: deleteMutation,
    isPending,
  } = useMutation({
    mutationFn: async (eventId: ScheduleItem["id"]) =>
      await deleteEvent({ data: eventId }),
    onSuccess: () => {
      toast.success("Event deleted.");
      if (actionBtnRef.current) actionBtnRef.current.click();
      return queryClient.invalidateQueries({ queryKey: ["scheduleItems"] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
    onSettled: () => setDeleteItem(null),
  });

  useEffect(() => {
    log(mutationData);
  }, [mutationData]);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!deleteItem) return toast.error("Something went wrong, try again.");
    deleteMutation(deleteItem);
  };

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
              <ContextMenu key={row.id}>
                <ContextMenuTrigger asChild>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        width={cell.column.getSize()}
                        className={`border-r-1 text-slate-200 text-base px-0`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    variant="destructive"
                    className="text-destructive-foreground font-medium cursor-pointer"
                    onClick={() => {
                      if (alertRef.current) {
                        setDeleteItem(Number(row.id));
                        return alertRef.current.click();
                      }
                    }}
                  >
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
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
      <AlertDialog>
        <AlertDialogTrigger className="hidden" ref={alertRef} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This event will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteItem(null)}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant={"outline"}
              className="text-destructive-foreground border-destructive-foreground focus-visible:ring-destructive/70 focus-visible:border-destructive hover:bg-destructive/90"
              onClick={(e) => handleDelete(e)}
            >
              {isPending ? <LoadingSpinnerMini /> : "Delete"}
            </Button>
            <AlertDialogAction className="hidden" ref={actionBtnRef} />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ScheduleTable;
