import { createServerFn } from "@tanstack/react-start";
import {
  createScheduleItemSchema,
  type ApiRes,
  type UpdatedScheduleItem,
} from "~/lib/types/schedule-types";
import { db } from "../db/db";
import { asc } from "drizzle-orm";
import { scheduleTable } from "../db/schema/schedule";
import { authMiddleware } from "./auth.api";

/**
 * Updates an existing schedule item in the database
 * @param {UpdatedScheduleItem} updatedItem - The updated data containing item id, column to update, and new value
 * @returns {Promise<ApiRes>} API response indicating success/failure
 * @throws {Error} When the item cannot be updated
 */
export const updateScheduleItem = async (
  updatedItem: UpdatedScheduleItem
): Promise<ApiRes> => {
  try {
    const res = await fetch("/api/v1/schedule", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    });
    if (!res.ok) throw new Error("Could not save, try again");

    const data: ApiRes = await res.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Deletes one or more schedule items from the database
 * @param {Array<number>} itemIds - Array of schedule item IDs to delete
 * @throws {Error} When one or more items cannot be deleted
 */
export const deleteScheduleItems = async (
  itemIds: Array<number>
): Promise<void> => {
  try {
    const res = await fetch("/api/v1/schedule", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemIds }),
    });

    if (!res.ok) throw new Error("Something went wrong, try again");
    return;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

export const getAllScheduleItems = createServerFn({
  method: "GET",
  response: "data",
})
  .middleware([authMiddleware])
  .handler(async () => {
    const res = await db.query.scheduleTable.findMany({
      orderBy: [asc(scheduleTable.startDate)],
    });

    return res;
  });

/**
 * Creates a new schedule item in the database
 * @param {NewScheduleItem} newItem - The schedule item data to create
 * @returns {Promise<ScheduleItem>} The newly created schedule item
 * @throws {Error} When the item cannot be saved
 */
export const addScheduleItem = createServerFn({
  method: "POST",
  response: "data",
})
  .middleware([authMiddleware])
  .validator(createScheduleItemSchema)
  .handler(async ({ data }) => {
    const insertData = {
      ...data,
      startDate:
        typeof data.startDate === "string"
          ? new Date(data.startDate)
          : data.startDate,
      endDate:
        typeof data.endDate === "string"
          ? new Date(data.endDate)
          : data.endDate,
    };
    const res = await db.insert(scheduleTable).values(insertData).returning();
    return res;
  });
