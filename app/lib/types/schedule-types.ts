// import type { ColumnFiltersState } from '@tanstack/react-table'

import { z } from "zod/v4";

// API Response
export type ApiRes = {
  status: string;
  message: string;
};

export interface ApiResWithData<T> extends ApiRes {
  status: string;
  message: string;
  data: {
    items: T;
  };
}

// Schedule Types
/**
 * Represents a schedule item as received from the API
 * @interface AllScheduleItems
 */
export interface AllScheduleItems {
  /** Unique identifier for the schedule item */
  id: number;
  /** Name/title of the scheduled event */
  name: string;
  /** Start date of the event */
  startDate: Date;
  /** End date of the event */
  endDate: Date;
  /** Current status of the event */
  status: Status;
  location: Location;
}

/**
 * Represents a schedule item after being formatted for display in the UI
 * @interface FormattedScheduleItems
 */
export interface FormattedScheduleItems {
  /** Unique identifier for the schedule item */
  id: string;
  /** Name/title of the scheduled event */
  name: string;
  /** Current status of the event */
  status: Status;
  /** Start date of the event */
  startDate: Date;
  /** End date of the event */
  endDate: Date;
  /** Location details of the event */
  location: Location | undefined;
}

/**
 * Represents a new schedule item to be created
 * @interface ScheduleItem
 */
// export interface ScheduleItem {
//   /** Name/title of the scheduled event */
//   name: string
//   /** Current status of the event */
//   status: Status
//   /** Optional start date of the event */
//   startDate?: Date
//   /** Optional end date of the event */
//   endDate?: Date
//   location?: Location
// }

/**
 * Represents a partial update to a schedule item
 * @interface UpdatedScheduleItem
 */
export interface UpdatedScheduleItem {
  /** ID of the schedule item to update */
  id: string;
  /** Name of the column/field to update */
  column: string;
  /** New value for the specified column */
  value: string | Date | undefined;
}

// /**
//  * Represents a location's address details
//  * @interface Location
//  */
// export interface Location {
//   /** Street address */
//   address: string
//   /** City name */
//   city: string
//   /** State/province name */
//   state: string
//   /** ZIP/postal code */
//   zip: string
// }

// type FiltersTableState = {
//   columnFilters: ColumnFiltersState
//   globalFilter: any
// }

// type ColumnFiltersState = Array<ColumnFilter>

// type ColumnFilter = {
//   id: string
//   value: unknown
// }

// TODO: MAKE FORMATTED FIELD A KEY-OPTIONAL field
export const locationSchema = z.object({
  address: z.string().trim().toLowerCase(),
  city: z.string().trim().toLowerCase(),
  state: z.string().trim().toUpperCase(),
  zip: z.string().trim(),
  formatted: z.string().nullable(),
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

export const scheduleItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  status: statusSchema,
  eventType: eventTypeSchema,
  location: locationSchema.nullable(),
  description: z.string().nullable(),
  notes: z.string().nullable(),
  bidId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createScheduleItemSchema = z.object({
  name: z.string().max(255).trim().toLowerCase(),
  startDate: z.date(),
  endDate: z.date(),
  status: statusSchema,
  eventType: eventTypeSchema,
  location: locationSchema.optional(),
  description: z.string().trim().toLowerCase().optional(),
  notes: z.string().trim().toLowerCase().optional(),
  bidId: z.string().trim().toLowerCase().optional(),
});

export type Location = z.infer<typeof locationSchema>;
export type Status = z.infer<typeof statusSchema>;
export type EventType = z.infer<typeof eventTypeSchema>;

export type NewScheduleItem = z.infer<typeof createScheduleItemSchema>;
export type ScheduleItem = z.infer<typeof scheduleItemSchema>;
