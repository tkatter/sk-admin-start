import { ChevronLeft, ChevronRight } from "lucide-react";

import type { ScheduleTableProps } from "~/components/schedule/ScheduleTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "~/components/ui/pagination";
import { Button } from "~/components/ui/button";
import { useSchedule } from "~/context/ScheduleContext";

interface TablePaginationProps extends ScheduleTableProps {
  numRows: number;
}

function TablePagination({ table, numRows }: TablePaginationProps) {
  const { pagination } = useSchedule();
  const totalNumPages = table.getPageCount();

  const pageIndex = pagination.pageIndex;
  const paginationSize = 3;
  let start = pageIndex;
  if (totalNumPages <= 3) start = 0;
  if (totalNumPages > 3 && pageIndex >= totalNumPages - 3)
    start = totalNumPages - 3;
  const end = start + paginationSize;

  const pageArray = Array.from({ length: totalNumPages }, (_, i) => i + 1);
  const visibleItems = pageArray.slice(start, end);

  const x = pageIndex * pagination.pageSize + 1;
  const y = Math.min((pageIndex + 1) * pagination.pageSize, numRows);
  const rowsVisible = `${x} - ${y}`;

  return (
    <Pagination className="relative flex items-center">
      <span className="absolute left-0 ml-4 flex items-center gap-2 text-sm">
        <span>{rowsVisible}</span> <span>of</span> <span>{numRows}</span>
      </span>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant={"ghost"}
            disabled={!table.getCanPreviousPage()}
            onClick={table.previousPage}
          >
            <ChevronLeft />
            Previous
          </Button>
        </PaginationItem>
        {visibleItems.map((page) => (
          <PaginationItem key={page}>
            <Button
              disabled={pageIndex + 1 === page ? true : false}
              onClick={() => table.setPageIndex(page - 1)}
              variant={"ghost"}
            >
              {page}
            </Button>
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            variant={"ghost"}
            disabled={!table.getCanNextPage()}
            onClick={table.nextPage}
          >
            Next
            <ChevronRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default TablePagination;
