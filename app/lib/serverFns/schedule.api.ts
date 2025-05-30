import { createMiddleware, createServerFn } from "@tanstack/react-start";
import type {
  // AllScheduleItems,
  ApiRes,
  ApiResWithData,
  FormattedScheduleItems,
  ScheduleItem,
  UpdatedScheduleItem,
} from "~/lib/types/schedule-types";
import { db } from "../db/db";
import { asc } from "drizzle-orm";
import { scheduleTable } from "../db/schema/schedule";

/*
export const getAllScheduleItems = async (): Promise<
  Array<FormattedScheduleItems>
> => {
  try {
    const res = await fetch("/api/v1/schedule", {
      method: "GET",
    });
    if (!res.ok && res.statusText === "Not Found")
      throw new Error("No items found");

    if (!res.ok)
      throw new Error("Something went wrong loading the schedule items");

    const data: ApiResWithData<Array<AllScheduleItems>> = await res.json();
    console.log(data);

    const items = data.data.items;
    const formattedItems = items.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      status: item.status,
      startDate: item.startDate,
      endDate: item.endDate,
      location: item.location,
    }));

    return formattedItems;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
*/

/**
 * Creates a new schedule item in the database
 * @param {ScheduleItem} newItem - The schedule item data to create
 * @returns {Promise<FormattedScheduleItems>} The newly created schedule item
 * @throws {Error} When the item cannot be saved
 */
export const addScheduleItem = async (
  newItem: ScheduleItem
): Promise<FormattedScheduleItems> => {
  try {
    const res = await fetch("/api/v1/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    });

    if (!res.ok) throw new Error("Could not save, try again");

    const data: ApiResWithData<FormattedScheduleItems> = await res.json();

    const item = data.data.items;
    return item;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

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

export const getAllScheduleItems = createServerFn({
  method: "GET",
  response: "data",
}).handler(async () => {
  const res = await db.query.scheduleTable.findMany({
    orderBy: [asc(scheduleTable.startDate)],
  });

  return res;
});
