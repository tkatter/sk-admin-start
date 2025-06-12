import { formatISO } from "date-fns";
import { prettifyError, z } from "zod/v4";
import { log } from "./lib/utils";

export const locationSchema = z.object({
  address: z
    .string("Address")
    .trim()
    .min(1, "Address is required")
    .toLowerCase(),
  city: z.string().trim().min(1, "Enter a city").toLowerCase(),
  state: z
    .string()
    .trim()
    .length(2, "Enter a state abbreviation")
    .toUpperCase(),
  zip: z.string().trim().length(5, "Invalid Zipcode"),
  formatted: z.string().optional(),
});

export const statusSchema = z.enum([
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
]);

export const eventTypeSchema = z.enum([
  "job",
  "meeting",
  "event",
  "appointment",
]);

const createEventSchema = z
  .object({
    name: z
      .string()
      .min(3, "Event must have a name")
      .max(255)
      .trim()
      .toLowerCase(),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    status: statusSchema,
    eventType: eventTypeSchema,
    hasLocation: z.boolean().default(false),
    location: locationSchema.optional(),
    description: z.string().trim().toLowerCase().optional(),
    notes: z.string().trim().toLowerCase().optional(),
    bidId: z.string().trim().toLowerCase().optional(),
  })
  .refine((schema) => !schema.hasLocation || !!schema.location, {
    error: "Location is required when hasLocation is true",
    path: ["location"],
  });

type Location = z.infer<typeof locationSchema>;
type Status = z.infer<typeof statusSchema>;
type EventType = z.infer<typeof eventTypeSchema>;
type NewScheduleItem = z.infer<typeof createEventSchema>;

const newEvent: NewScheduleItem = {
  hasLocation: true,
  name: "thomas",
  endDate: formatISO(new Date(Date.now())),
  startDate: formatISO(new Date(Date.now())),
  eventType: "appointment",
  status: "cancelled",
};

const result = createEventSchema.safeParse(newEvent);
result.success ? log(result) : log(prettifyError(result.error));
