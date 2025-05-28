// import type { ColumnFiltersState } from '@tanstack/react-table'

import type { Location } from '../utils'

// API Response
export type ApiRes = {
  status: string
  message: string
}

export interface ApiResWithData<T> extends ApiRes {
  status: string
  message: string
  data: {
    items: T
  }
}

// Schedule Types
/**
 * Represents a schedule item as received from the API
 * @interface AllScheduleItems
 */
export interface AllScheduleItems {
  /** Unique identifier for the schedule item */
  id: number
  /** Name/title of the scheduled event */
  name: string
  /** Start date of the event */
  startDate: Date
  /** End date of the event */
  endDate: Date
  /** Current status of the event */
  status: Status
  location: Location
}

/**
 * Represents a schedule item after being formatted for display in the UI
 * @interface FormattedScheduleItems
 */
export interface FormattedScheduleItems {
  /** Unique identifier for the schedule item */
  id: string
  /** Name/title of the scheduled event */
  name: string
  /** Current status of the event */
  status: Status
  /** Start date of the event */
  startDate: Date
  /** End date of the event */
  endDate: Date
  /** Location details of the event */
  location: Location | undefined
}

/**
 * Represents a new schedule item to be created
 * @interface ScheduleItem
 */
export interface ScheduleItem {
  /** Name/title of the scheduled event */
  name: string
  /** Current status of the event */
  status: Status
  /** Optional start date of the event */
  startDate?: Date
  /** Optional end date of the event */
  endDate?: Date
  location?: Location
}

/**
 * Represents a partial update to a schedule item
 * @interface UpdatedScheduleItem
 */
export interface UpdatedScheduleItem {
  /** ID of the schedule item to update */
  id: string
  /** Name of the column/field to update */
  column: string
  /** New value for the specified column */
  value: string | Date | undefined
}

/**
 * Represents the possible states of a schedule item
 * - 'pending': Item is awaiting confirmation
 * - 'confirmed': Item has been approved/confirmed
 * - 'in-progress': Work has begun on this item
 */
export type Status = 'pending' | 'confirmed' | 'in-progress'

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
