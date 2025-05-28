import type { BidSelect } from "~/lib/db/schema/bid";

import { bids } from "~/lib/db/schema/bid";
import { relations } from "drizzle-orm";
import { json } from "drizzle-orm/pg-core";
import {
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "job",
  "meeting",
  "event",
  "appointment",
]);

export interface Location {
  city?: string;
  formatted?: string;
  state?: string;
  zipCode?: string;
  street?: string;
  // Optional: formatted full address for display
}

export const scheduleTable = pgTable("schedule", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),

  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),

  status: statusEnum().notNull().default("pending"),
  eventType: eventTypeEnum("event_type").notNull().default("job"),

  location: json("location").$type<Location>(),

  address: varchar({ length: 100 }),
  city: varchar({ length: 100 }),
  state: varchar({ length: 2 }),
  zip: varchar({ length: 12 }),

  description: text(),
  notes: text(),

  bidId: uuid("bid_id"),

  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const scheduleRelations = relations(scheduleTable, ({ one }) => ({
  bid: one(bids, {
    fields: [scheduleTable.bidId],
    references: [bids.id],
  }),
}));

export type InsertScheduleItem = typeof scheduleTable.$inferInsert;
export type SelectScheduleItem = typeof scheduleTable.$inferSelect;

export type ScheduleItemWithBid = SelectScheduleItem & {
  bid?: BidSelect; // Replace with proper Bid type when implemented
};

// TODO: UNCOMMENT WHEN FILE TABLE IS IMPLEMENTED
// export const scheduleFiles = pgTable('schedule_files', {
//   id: serial().primaryKey(),
//   scheduleId: serial('schedule_id').notNull().references(() => scheduleTable.id, { onDelete: 'cascade' }),
//   fileId: uuid('file_id').notNull(), // References your files table when implemented
//   uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
// });

// Add to schedule relations
// export const scheduleRelations = relations(scheduleTable, ({ one, many }) => ({
//   files: many(scheduleFiles),
// bid relation when implemented
// }));

// export const scheduleFilesRelations = relations(scheduleFiles, ({ one }) => ({
//   schedule: one(scheduleTable, {
//     fields: [scheduleFiles.scheduleId],
//     references: [scheduleTable.id],
//   }),
// file: one(files, {
//   fields: [scheduleFiles.fileId],
//   references: [files.id],
// }),
// }));
