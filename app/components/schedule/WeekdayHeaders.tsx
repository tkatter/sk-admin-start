interface WeekdayHeadersProps {
  weekDays: Array<{ day: string; abv: string }>;
}

/**
 * Renders the weekday headers for the calendar
 */
export function WeekdayHeaders({ weekDays }: WeekdayHeadersProps) {
  return (
    <>
      {weekDays.map((day) => (
        <div
          key={day.abv}
          className="py-2 lg:py-4 px-4 lg:px-8 flex flex-col items-center border-b-1"
        >
          <h2 className="text-sm md:text-base lg:text-lg xl:text-xl font-semibold">
            {day.day}
          </h2>
        </div>
      ))}
    </>
  );
}
