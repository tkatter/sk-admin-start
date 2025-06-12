import { useMemo, useState } from "react";
import {
  add,
  getDate,
  getMonth,
  startOfMonth,
  startOfToday,
  sub,
} from "date-fns";

/**
 * Hook to manage calendar date-related state and operations
 * @returns Calendar state and navigation functions
 */
export function useCalendarState() {
  const initialDay = startOfToday();
  const [baseDay, setBaseDay] = useState(initialDay);
  return useMemo(() => {
    const currentDate = getDate(baseDay);
    const currentMonth = getMonth(baseDay);
    const firstDayInMonth = startOfMonth(baseDay);
    const todayDate = getDate(initialDay);
    const todayMonth = getMonth(initialDay);

    return {
      baseDay,
      currentDate,
      currentMonth,
      firstDayInMonth,
      todayDate,
      todayMonth,
      goToNextMonth: () => setBaseDay((prev) => add(prev, { months: 1 })),
      goToPreviousMonth: () => setBaseDay((prev) => sub(prev, { months: 1 })),
      goToToday: () => setBaseDay(initialDay),
    };
  }, [baseDay, initialDay]);
}
