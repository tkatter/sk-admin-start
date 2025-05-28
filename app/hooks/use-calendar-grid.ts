import { useMemo } from 'react'
import {
  differenceInCalendarDays,
  getDate,
  getDaysInMonth,
  isSunday,
  previousSunday,
} from 'date-fns'

/**
 * Hook to manage calendar grid calculations
 * @param firstDayInMonth - First day of the current month
 * @returns Grid-related calculations and arrays
 */
export function useCalendarGrid(firstDayInMonth: Date, baseDay: Date) {
  return useMemo(() => {
    // Calculate offset for the first day of the month
    let offsetStart: number
    let offset: number

    if (isSunday(firstDayInMonth)) {
      offsetStart = 0
      offset = 0
    } else {
      const startDate = previousSunday(firstDayInMonth)
      offsetStart = getDate(startDate)
      offset = differenceInCalendarDays(firstDayInMonth, startDate)
    }

    // Calculate days in month and create days array
    const daysInMonth = getDaysInMonth(baseDay)
    let daysArray: Array<number>

    if ([28, 35].includes(daysInMonth + offset)) {
      daysArray = Array.from({ length: daysInMonth + offset }, (_, i) => i)
    } else {
      const additionalDays = 35 - (daysInMonth + offset)
      daysArray = Array.from(
        { length: daysInMonth + offset + additionalDays },
        (_, i) => i,
      )
    }

    return {
      offsetStart,
      offset,
      daysInMonth,
      daysArray,
    }
  }, [firstDayInMonth, baseDay])
}
