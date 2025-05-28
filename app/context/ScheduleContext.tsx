import { createContext, use, useEffect, useReducer, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginationState, RowSelectionState } from "@tanstack/react-table";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { FormattedScheduleItems } from "~/lib/types/schedule-types";
import type { Filter } from "~/routes/(app)/schedule/-pages/SchedulePage";
import { scheduleQueries } from "~/lib/queries";
import { scheduleMutations } from "~/lib/queries";

/**
 * Type definition for Schedule Context
 * Extends InitialStateType with additional methods and state handlers
 */
interface ScheduleContextType extends InitialStateType {
  dispatch: React.ActionDispatch<
    [
      {
        type: any;
        payload: any;
      }
    ]
  >;
  rowSelection: RowSelectionState | {};
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  updateDbFromLocal: (itemId: string, columnId: string, value: string) => void;
  deleteItemsDb: UseMutateFunction<void, Error, Array<number>, unknown>;
}

/**
 * Initial state type for the Schedule Context
 */
interface InitialStateType {
  data: Array<FormattedScheduleItems> | [];
  columnFilters: Array<Filter> | [];
  isHidden: boolean;
}

/**
 * Union type for all possible dispatch actions in the Schedule Context
 */
type MYDispatch =
  | { type: "syncDbToTable"; payload: Array<FormattedScheduleItems> }
  | { type: "filterChange"; payload: Filter }
  | { type: "clearFilters"; payload: string }
  | { type: "hidden"; payload: null }
  | { type: "showHidden"; payload: null }
  | {
      type: "localDataChange";
      payload: {
        itemId: string;
        columnId: string;
        value: string | Date | undefined;
      };
    };

const ScheduleContext = createContext<ScheduleContextType | null>(null);

const initialState: InitialStateType = {
  data: [],
  columnFilters: [],
  isHidden: false,
};

/**
 * Reducer function for managing schedule state
 * @param state - Current state
 * @param action - Action object containing type and payload
 * @returns New/updated state
 */
function reducer(state: typeof initialState, { type, payload }: MYDispatch) {
  switch (type) {
    case "syncDbToTable":
      if (state.data === payload) return { ...state };
      return {
        ...state,
        data: payload,
      };
    case "filterChange":
      return {
        ...state,
        columnFilters: state.columnFilters
          .filter((filter) => filter.id !== payload.id)
          .concat({ id: payload.id, value: payload.value }),
      };
    case "clearFilters":
      return {
        ...state,
        columnFilters: state.columnFilters.filter(
          (filter) => filter.id !== payload
        ),
      };
    case "hidden":
      return {
        ...state,
        isHidden: true,
      };
    case "showHidden":
      return {
        ...state,
        isHidden: false,
      };
    default:
      throw new Error("Unknown Action Type");
  }
}

/**
 * Schedule Provider Component
 * Manages schedule state and provides data and actions to child components
 * @param props - Component props
 * @param props.children - Child components
 * @returns Provider component wrapping children
 */
function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [{ data, columnFilters, isHidden }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { data: items } = useQuery({
    ...scheduleQueries.getAllScheduleItemsOpts(),
    throwOnError: (e) => {
      return e.message === "No items found" ? false : true;
    },
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const { mutate: updateItemDb } = useMutation({
    ...scheduleMutations.updateScheduleItemMutationOptions,
    onSuccess: () => {
      toast.success("Item updated");
    },
    onError: (err) => {
      toast.error(`${err.message}`);
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ["scheduleItems"] });
    },
  });
  const { mutate: deleteItemsDb } = useMutation({
    ...scheduleMutations.deleteScheduleItemsMutationOptions,
    onSuccess: () => {
      toast.success("Items deleted");
    },
    onError: (err) => {
      toast.error(`${err.message}`);
    },
    onSettled: () => {
      setRowSelection({});
      return queryClient.invalidateQueries({ queryKey: ["scheduleItems"] });
    },
  });

  // Keep local table data state in-sync with db data
  useEffect(() => {
    if (items) dispatch({ type: "syncDbToTable", payload: items });
  }, [items]);

  /**
   * Updates a schedule item in the database and triggers optimistic update in the local state
   * @param itemId - ID of the item to update
   * @param columnId - Column identifier for the field being updated
   * @param value - New value for the field
   * @throws {Error} When the update fails
   */
  function updateDbFromLocal(
    itemId: string,
    columnId: string,
    value: string
  ): void {
    const updatedItem = {
      id: itemId,
      column: columnId,
      value,
    };

    updateItemDb(updatedItem);
  }

  return (
    <ScheduleContext.Provider
      value={{
        data,
        isHidden,
        columnFilters,
        rowSelection,
        setRowSelection,
        pagination,
        setPagination,
        dispatch,
        updateDbFromLocal,
        deleteItemsDb,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

/**
 * Custom hook for accessing Schedule context
 * @throws {Error} When used outside of ScheduleProvider
 * @returns Schedule context value
 */
function useSchedule() {
  const context = use(ScheduleContext);
  if (context === null)
    throw new Error("Schedule context was used outside of the provider");
  return context;
}

export { ScheduleProvider, useSchedule };
