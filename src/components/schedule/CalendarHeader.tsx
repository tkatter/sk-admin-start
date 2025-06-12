import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";

interface CalendarHeaderProps {
  currentMonth: string | undefined;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

/**
 * Header component for the calendar with navigation controls
 */
export function CalendarHeader({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="col-span-full relative flex justify-center items-center size-full py-2 lg:py-5 border-b-2">
      <Button
        variant={"outline"}
        className="absolute left-0 top-0 translate-y-1/2 ml-8"
        onClick={onPreviousMonth}
      >
        <ChevronLeft className="size-8" />
      </Button>
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
        {currentMonth}
      </h1>
      <div className="absolute right-0 top-0 translate-y-1/2 mr-8 flex items-center gap-8">
        <Button variant={"default"} className="px-8" onClick={onToday}>
          Today
        </Button>
        <Button variant={"outline"} onClick={onNextMonth}>
          <ChevronRight className="size-8" />
        </Button>
      </div>
    </div>
  );
}
