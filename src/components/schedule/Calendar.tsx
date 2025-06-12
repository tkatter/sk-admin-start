import { useMemo } from "react";
import { isSameDay } from "date-fns";
import { CalendarHeader } from "./CalendarHeader";
import { WeekdayHeaders } from "./WeekdayHeaders";
import { CalendarDayCell } from "./CalendarDayCell";
import { useCalendarState } from "~/hooks/use-calendar-state";
import { useCalendarGrid } from "~/hooks/use-calendar-grid";
import { useSchedule } from "~/context/ScheduleContext";
import { MONTHS, WEEKDAYS } from "~/lib/constants";
import { getEventTypeColor } from "~/lib/utils";

/**
 * Calendar component that displays a monthly view of schedule events
 * Includes navigation between months, today's date highlight, and event display
 * @returns The rendered Calendar component
 */
function Calendar() {
  const { data } = useSchedule();
  const {
    baseDay,
    currentMonth,
    firstDayInMonth,
    todayDate,
    todayMonth,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
  } = useCalendarState();

  const {
    offsetStart,
    offset,
    daysInMonth,
    daysArray: daysInMonthArr,
  } = useCalendarGrid(firstDayInMonth, baseDay);

  const getEventsForDay = useMemo(
    () => (date: Date) =>
      data.filter((event) => isSameDay(new Date(event.startDate), date)),
    [data]
  );

  return (
    <div className="container-lg xl:container mx-auto max-sm:hidden">
      <div className="border-2 grid grid-cols-7 rounded-lg bg-slate-900/40 shadow-lg text-lg font-medium">
        <CalendarHeader
          currentMonth={MONTHS[currentMonth]?.month}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
        />

        <WeekdayHeaders weekDays={WEEKDAYS} />

        {daysInMonthArr.map((day) => {
          const isToday =
            day - offset + 1 === todayDate && currentMonth === todayMonth;

          const commonProps = {
            day,
            offset,
            daysInMonth,
            offsetStart,
            firstDayInMonth,
            getEventsForDay,
            getEventTypeColor,
          };

          if (day < offset) {
            return (
              <CalendarDayCell
                key={`past_${day}`}
                {...commonProps}
                type={isToday ? "today" : "past"}
              />
            );
          }

          if (day + 1 <= daysInMonth + offset) {
            return (
              <CalendarDayCell
                key={`current_${day}`}
                {...commonProps}
                type={isToday ? "today" : "current"}
              />
            );
          }

          return (
            <CalendarDayCell
              key={`future_${day}`}
              {...commonProps}
              type="future"
            />
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
