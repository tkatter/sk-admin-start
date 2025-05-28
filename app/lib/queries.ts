import { queryOptions } from "@tanstack/react-query";
import { getUserSession } from "~/lib/serverFns/auth.api";
import type {
  AllScheduleItems,
  ApiResWithData,
  FormattedScheduleItems,
  UpdatedScheduleItem,
} from "~/lib/types/schedule-types";
import {
  deleteScheduleItems,
  getAllScheduleItems,
  updateScheduleItem,
} from "./serverFns/schedule.api";

export const authQueries = {
  all: ["auth"],
  user: () =>
    queryOptions({
      queryKey: [...authQueries.all, "user"],
      queryFn: () => getUserSession(),
    }),
};

export const scheduleQueries = {
  getAllScheduleItemsOpts: () => {
    return queryOptions({
      queryKey: ["scheduleItems"],
      queryFn: async () => await getAllScheduleItems(),
      staleTime: 1000 * 180,
    });
  },
};

export const scheduleMutations = {
  updateScheduleItemMutationOptions: {
    mutationKey: ["updateItem"],
    mutationFn: (updatedItem: UpdatedScheduleItem) =>
      updateScheduleItem(updatedItem),
  },
  deleteScheduleItemsMutationOptions: {
    mutationKey: ["deleteItems"],
    mutationFn: (itemIds: Array<number>) => deleteScheduleItems(itemIds),
  },
};
