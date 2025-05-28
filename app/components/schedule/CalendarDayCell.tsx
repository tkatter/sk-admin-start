import { add, getDate } from "date-fns";
import { Link } from "@tanstack/react-router";
import type { FormattedScheduleItems } from "~/lib/types/schedule-types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

interface CalendarDayCellProps {
  day: number;
  offset: number;
  daysInMonth: number;
  offsetStart: number | Date;
  currentDate?: number;
  firstDayInMonth: Date;
  getEventsForDay: (date: Date) => Array<FormattedScheduleItems>;
  getEventTypeColor: (status: FormattedScheduleItems["status"]) => string;
  type: "past" | "current" | "future" | "today";
}

/**
 * Renders a single day cell in the calendar
 */
export function CalendarDayCell({
  day,
  offset,
  daysInMonth,
  offsetStart,
  firstDayInMonth,
  getEventsForDay,
  getEventTypeColor,
  type,
}: CalendarDayCellProps) {
  const getBorderClasses = (dayNum: number) => {
    const hasRightBorder = ![7, 14, 21, 28, 35].includes(dayNum + 1)
      ? "border-r-1"
      : "";
    const hasBottomBorder =
      type === "current"
        ? 28 <= dayNum && dayNum <= 35
          ? ""
          : "border-b-1"
        : "border-b-1";
    return `${hasRightBorder} ${hasBottomBorder}`;
  };
  const getDateNumber = () => {
    switch (type) {
      case "past":
        return getDate(offsetStart) + day;
      case "current":
      case "today":
        return day - offset + 1;
      case "future":
        return day + 1 - (daysInMonth + offset);
    }
  };
  const getDayClasses = () => {
    if (type === "today") {
      return "bg-slate-800/50 ring-2 ring-slate-400/50";
    }
    if (type !== "current") {
      return "bg-slate-950/70";
    }
    return "";
  };

  return (
    <div
      key={`${type}_${day}`}
      className={`aspect-square w-full ${getDayClasses()} ${getBorderClasses(
        day
      )}`}
    >
      <span className="ml-2 block mt-2">{getDateNumber()}</span>
      {(type === "current" || type === "today") &&
        getEventsForDay(add(firstDayInMonth, { days: day - offset + 1 })).map(
          (event) => (
            <HoverCard key={event.id}>
              <HoverCardTrigger asChild>
                <div
                  className={`cursor-pointer text-xs p-1 mx-2 shadow-md rounded-md w-[calc(100% - calc(var(--spacing) * 2))] ${getEventTypeColor(
                    event.status
                  )}`}
                >
                  <p className="capitalize">{event.name}</p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent>
                <EventHoverCard event={event} />
              </HoverCardContent>
            </HoverCard>
          )
        )}
    </div>
  );
}

/**
 * A card displayed on hover showing the details for an event
 * @param event
 * @returns
 */
function EventHoverCard({ event }: { event: FormattedScheduleItems }) {
  const {
    location: { address, city, state, zip },
  } = event;
  const formattedAddress = `${address} ${city} ${state.toUpperCase()}, ${zip}`;

  const mapUrl = new URL("https://www.google.com/maps/search/?api=1&");
  mapUrl.search = "api=1&query=" + formattedAddress;

  return (
    <>
      <ul>
        <li className="mb-2 capitalize">{event.name}</li>
        <li className="text-sm">
          <Link
            to={mapUrl.toString()}
            target="_blank"
            className="underline decoration-accent-foreground"
          >
            {formattedAddress}
          </Link>
        </li>
      </ul>
    </>
  );
}
