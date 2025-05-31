import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useFieldContext } from "../../hooks/appForm";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Label } from "../ui/label";

function DatePickerField({
  className = "",
  label,
}: {
  className?: string;
  label?: string;
}) {
  const field = useFieldContext<Date>();

  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    if (field.form.state.isSubmitted)
      return setDate({ from: undefined, to: undefined });
  }, [field.form.state.isSubmitted]);

  function handleChange(dateRange: DateRange | undefined) {
    setDate(dateRange);

    // field.handleChange(dateRange?.from ? dateRange.from.toISOString() : "");
    field.form.setFieldValue("startDate", dateRange?.from);
    field.form.setFieldValue("endDate", dateRange?.to);
    field.form.validateField("startDate", "change");
    field.form.validateField("endDate", "change");
  }

  return (
    <div className="flex flex-col items-start gap-3">
      {label && <Label>{label}</Label>}
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default DatePickerField;
