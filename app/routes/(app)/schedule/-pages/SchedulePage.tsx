import { Eye } from "lucide-react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import AddItemDialog from "~/components/schedule/AddItemDialog";
import Calendar from "~/components/schedule/Calendar";
import ScheduleTable from "~/components/schedule/ScheduleTable";
import { FilterInput, FilterPopover } from "~/components/schedule/TableFilters";
import TablePagination from "~/components/schedule/TablePagination";
import TableSize from "~/components/schedule/TableSize";
import { useSchedule } from "~/context/ScheduleContext";
import { Button } from "~/components/ui/button";
import { columns } from "~/lib/schedule-columns";

export type Filter = {
  id: string;
  value: string;
};

function SchedulePage() {
  const {
    data,
    isHidden,
    columnFilters,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    dispatch,
  } = useSchedule();

  // Define Table
  const table = useReactTable({
    data,
    columns,
    initialState: {
      columnVisibility: {
        id: false,
        name: true,
        startDate: true,
        endDate: true,
        status: true,
        eventType: true,
        location: true,
        // address: false,
        // city: false,
        // state: false,
        // zip: false,
        hasLocation: false,
      },
    },
    // debugTable: true,
    state: { columnFilters, rowSelection, pagination },
    getRowId: (row) => row.id.toString(),
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    columnResizeMode: "onChange",
    autoResetPageIndex: false,
  });

  function showHiddenCols() {
    dispatch({ type: "showHidden", payload: null });
    table.resetColumnVisibility();
  }

  const numRows = data.length;

  return (
    <div className="flex flex-col gap-30">
      <Calendar />
      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center max-sm:gap-2 gap-4">
            <FilterInput />
            <FilterPopover />
            {isHidden && (
              <Button onClick={showHiddenCols}>
                <Eye />
                <p className="max-sm:hidden">Show hidden</p>
              </Button>
            )}
          </div>
          <div className="flex items-center max-sm:gap-2 gap-4">
            <AddItemDialog />
            <TableSize table={table} />
          </div>
        </div>
        <ScheduleTable table={table} />
        <div className="flex justify-between items-center">
          <TablePagination table={table} numRows={numRows} />
        </div>
      </div>
    </div>
  );
}
export default SchedulePage;
