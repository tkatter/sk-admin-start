import type { Status, Location } from "~/lib/types/schedule-types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const log = (...args: unknown[]): void => {
  console.log("LOGGER: ", ...args);
};

/**
 * Returns the Tailwind CSS background color class based on the event status
 * @param status - The status of the event ('pending', 'confirmed', 'in-progress', 'completed', or 'cancelled')
 * @returns The Tailwind CSS class name for the background color
 * @example
 * const bgColor = getEventTypeColor('pending') // returns 'bg-amber-600/70'
 */
export function getEventTypeColor(status: Status) {
  let color;

  switch (status) {
    case "pending":
      return (color = "bg-amber-600/70");
    case "confirmed":
      return (color = "bg-green-600/70");
    case "in-progress":
      return (color = "bg-teal-600/70");
    case "completed":
      return (color = "bg-amber-600/70");
    case "cancelled":
      return (color = "bg-amber-600/70");
    default:
      return (color = "#fff");
  }
}

export const formatCurrency = () => {};

/**
 * Formats a location object into a human-readable string representation.
 *
 * @param location - The location object to format, or null
 * @returns A formatted location string with comma-separated address components, or an empty string if location is null
 *
 * @example
 * ```typescript
 * const location = {
 *   address: "123 Main St",
 *   city: "Springfield",
 *   state: "IL",
 *   zip: "62701"
 * };
 * formatLocation(location); // Returns "123 Main St, Springfield, IL 62701"
 * ```
 *
 * @remarks
 * - Returns the `formatted` property if it exists on the location object
 * - Combines address, city, and state/zip into a comma-separated string
 * - Filters out any falsy values to avoid empty segments
 * - When both state and zip are present, they are combined with a space
 */
export const formatLocation = (location: Location | null) => {
  if (!location) return "";
  if (location.formatted) return location.formatted;

  const parts = [
    location.address,
    location.city,
    location.state && location.zip
      ? `${location.state} ${location.zip}`
      : location.state || location.zip,
  ].filter(Boolean);

  return parts.join(", ");
};

/**
 * Parses a location string in the format "123 Main St, City, ST 12345" into structured location components.
 *
 * @param locationString - A comma-separated location string containing address, city, state, and zip code
 * @returns A Location object with parsed components (address, city, state, zip) and the original formatted string.
 *          If parsing fails, returns an object with only the formatted string.
 *
 * @example
 * ```typescript
 * const location = parseLocationString("123 Main St, Springfield, IL 62701");
 * // Returns: { address: "123 Main St", city: "Springfield", state: "IL", zip: "62701", formatted: "123 Main St, Springfield, IL 62701" }
 * ```
 */
export function parseLocationString(
  locationString: string
): Location | { formatted: string } {
  // Simple parser for "123 Main St, City, ST 12345" format
  const parts = locationString.split(",").map((part) => part.trim());

  if (parts.length >= 3) {
    const stateZipMatch = parts[parts.length - 1].match(
      /^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/
    );

    return {
      address: parts.slice(0, -2).join(", "),
      city: parts[parts.length - 2],
      state: stateZipMatch?.[1],
      zip: stateZipMatch?.[2],
      formatted: locationString,
    };
  }
  return { formatted: locationString };
}

/**
 * Generates a Google Maps URL and formatted address string from a Location object.
 *
 * @param location - The location object containing address information. Can either have
 *                   a pre-formatted address string or individual address components
 *                   (address, city, state, zip).
 * @returns A tuple containing the Google Maps URL object and the formatted address string.
 *          The URL points to a Google Maps search for the given location.
 *
 * @example
 * ```typescript
 * const location = { address: "123 Main St", city: "Anytown", state: "ca", zip: "12345" };
 * const [mapUrl, address] = getMapsUrl(location);
 * console.log(mapUrl.toString()); // "https://www.google.com/maps/search/?api=1&query=123%20Main%20St%20Anytown%20CA%2C%2012345"
 * console.log(address); // "123 Main St Anytown CA, 12345"
 * ```
 */
export function getMapsUrl(location: Location): [URL, string] {
  let formattedAddress;

  if (location.formatted) {
    formattedAddress = location.formatted;
  } else {
    const { address, city, state, zip } = location;
    formattedAddress = `${address.toLowerCase()} ${city.toLowerCase()} ${state.toUpperCase()}, ${zip}`;
  }

  const mapUrl = new URL("https://www.google.com/maps/search/?api=1&");
  mapUrl.search = "api=1&query=" + formattedAddress;

  return [mapUrl, formattedAddress];
}
