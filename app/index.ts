import { db } from "./lib/db/db";
import { scheduleTable } from "./lib/db/schema/schedule";
import type { NewScheduleItem, ScheduleItem } from "./lib/types/schedule-types";
import { createScheduleItemSchema } from "./lib/types/schedule-types";
import { log } from "./lib/utils";

// async function getScheduleItems() {
//   console.log(await db.query.scheduleTable.findMany());
// }

// getScheduleItems();

async function createScheduleItem(newItem: NewScheduleItem) {
  const validate = createScheduleItemSchema.safeParse(newItem);
  if (!validate.success) throw new Error("Bad Schema");

  const res = await db.insert(scheduleTable).values(newItem).returning();
  log(res);

  // NOTE: Doesnt work because of locationSchema formatted field
  // return res;
}

const newItem: NewScheduleItem = {
  endDate: new Date(Date.now()),
  startDate: new Date(Date.now()),
  eventType: "event",
  // location: {
  //   address: "14120 269th AVE NW",
  //   city: "zimmerman",
  //   state: "mn",
  //   zip: "55398",
  // },
  name: "Test Item 3",
  status: "pending",
  notes:
    "This is a test item to see how my zod schemas and types are working when adding an item to the database",
};

createScheduleItem(newItem);

// import { z } from "zod/v4";

// const testSchema = z.object({
//   name: z.string().toLowerCase(),
//   description: z.string().optional(),
// });

// type Test = z.infer<typeof testSchema>;

// console.log(testSchema.safeParse(testObj));
