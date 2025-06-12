import type { Location } from "~/lib/db/schema/schedule";

import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const bidStatusEnum = pgEnum("bid_status", [
  "draft",
  "submitted",
  "accepted",
  "rejected",
  "in_review",
]);

/**
 * Enumeration of unit types used for measuring work items in construction bids.
 *
 * @description Defines the various measurement units that can be applied to bid items,
 * ranging from area measurements to time-based pricing models.
 *
 * @enum {string}
 * `sq_ft` - Square feet (area measurement)
 * - `linear_ft` - Linear feet (length measurement)
 * - `each` - Per unit/item count
 * - `hour` - Hourly rate
 * - `cu_ft` - Cubic feet (volume measurement)
 * - `day` - Daily rate
 * - `lump_sum` - Fixed total price regardless of quantity
 */
export const unitTypeEnum = pgEnum("unit_type", [
  "sq_ft",
  "linear_ft",
  "each",
  "hour",
  "cu_ft",
  "day",
  "lump_sum",
]);

export const templateCategoryEnum = pgEnum("template_category", [
  "framing",
  "finishing",
  "installation",
  "demolition",
  "electrical",
  "plumbing",
  "materials",
  "labor",
  "permits",
  "cleanup",
  "other",
]);

// Template Table
/**
 * Database table schema for bid templates.
 *
 * Stores reusable templates that can be used to create bids with predefined
 * structure and content.
 *
 * @table bid_templates
 *
 * @field id - Unique identifier for the bid template (UUID, auto-generated)
 * @field name - Display name of the bid template (max 255 characters)
 * @field description - Optional detailed description of the template
 * @field isActive - Whether the template is currently active and available for use
 * @field createdAt - Timestamp when the template was created
 * @field updatedAt - Timestamp when the template was last modified (auto-updated)
 */
export const bidTemplates = pgTable("bid_templates", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Template Items Table
/**
 * Database table schema for template items used in bid templates.
 *
 * Template items represent standardized work items that can be reused across multiple bids.
 * Each item includes pricing, categorization, and ordering information to streamline
 * the bid creation process.
 *
 * @table template_items
 *
 * @field id - Primary key, auto-generated UUID
 * @field templateId - Foreign key reference to bid_templates.id with cascade delete
 * @field itemName - Name/title of the work item (max 255 characters)
 * @field unitPrice - Price per unit with 10 digits precision, 2 decimal places
 * @field unitType - Type of unit for measurement (enum: unitTypeEnum)
 * @field category - Category classification for the item (enum: templateCategoryEnum)
 * @field description - Optional detailed description of the work item
 * @field isActive - Boolean flag indicating if the item is currently active (default: true)
 * @field sortOrder - Decimal value for ordering items within templates (default: 0, precision: 5.2)
 * @field createdAt - Timestamp when the record was created (auto-set)
 * @field updatedAt - Timestamp when the record was last modified (auto-updated)
 */
export const templateItems = pgTable("template_items", {
  id: uuid().primaryKey().defaultRandom(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => bidTemplates.id, { onDelete: "cascade" }),

  itemName: varchar("item_name", { length: 255 }).notNull(),

  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  unitType: unitTypeEnum("unit_type").notNull(),

  category: templateCategoryEnum("category").notNull(),

  description: text(),
  isActive: boolean().notNull().default(true),
  sortOrder: decimal("sort_order", { precision: 5, scale: 2 }).default("0"),

  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Bid Table
/**
 * Database table schema for storing construction project bids.
 *
 * This table manages the complete lifecycle of bids from draft to completion,
 * including client information, project details, financial calculations, and metadata.
 *
 * @table bids
 *
 * @field id - Primary key UUID, auto-generated
 * @field jobName - Name/title of the construction job (max 255 chars)
 * @field status - Current bid status (draft, sent, accepted, rejected, etc.)
 *
 * @section Client/Builder Information
 * @field builderClientName - Name of the client or builder (max 255 chars)
 * @field contactPhone - Contact phone number (max 20 chars)
 * @field contactEmail - Contact email address (max 255 chars)
 *
 * @section Project Details
 * @field jobLocation - JSON object containing location information
 * @field projectStartDate - Planned project start date
 * @field projectEndDate - Planned project completion date
 * @field projectDescription - Detailed description of the project work
 *
 * @section Financial Information
 * @field subtotal - Pre-tax total amount (12,2 decimal precision)
 * @field taxRate - Tax rate as decimal (5,4 precision for percentage rates)
 * @field taxAmount - Calculated tax amount (12,2 decimal precision)
 * @field totalAmount - Final total including tax (12,2 decimal precision)
 *
 * @section References and Relationships
 * @field templateId - Optional reference to bid template used for creation
 *
 * @section Additional Information
 * @field notes - General notes visible on bid documents
 * @field privateNotes - Internal notes not shown on customer-facing documents
 * @field bidValidUntil - Expiration date for the bid offer
 *
 * @section Metadata
 * @field createdAt - Timestamp when bid was created
 * @field updatedAt - Timestamp when bid was last modified (auto-updated)
 *
 * @todo Add file references for submitted bid documents
 * @todo Consider adding contactId reference to contacts table
 * @todo Consider adding scheduleEventId for approved bids that become jobs
 */
export const bids = pgTable("bids", {
  id: uuid().primaryKey().defaultRandom(),
  jobName: varchar({ length: 255 }).notNull(),
  status: bidStatusEnum("status").notNull().default("draft"),

  // Client/Builder information
  builderClientName: varchar({ length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }),
  contactEmail: varchar("contact_email", { length: 255 }),

  // Project details
  jobLocation: json("job_location").$type<Location>(),
  projectStartDate: timestamp("project_start_date"),
  projectEndDate: timestamp("project_end_date"),
  projectDescription: text("project_description"),

  // Financial Information
  subtotal: decimal("subtotal", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  taxRate: decimal("tax_rate", { precision: 5, scale: 4 }).default("0"),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),

  // TODO: File references
  // submittedBidFileId: uuid('submitted_bid_file_id'), // Reference to files table

  // Template reference (if created from template)
  templateId: uuid("template_id").references(() => bidTemplates.id),

  // Additional fields
  notes: text("notes"),
  privateNotes: text("private_notes"), // Private notes not shown on PDF
  bidValidUntil: timestamp("bid_valid_until"),

  // Metadata
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  // Optional: Link to contacts table if implemented
  // contactId: uuid("contact_id").references(() => contacts.id),

  // Optional: Link to schedule events if bid becomes a job
  // scheduleEventId: uuid("schedule_event_id").references(() => scheduleEvents.id),
});

// Bid Items Table
/**
 * Database table schema for bid items.
 *
 * Represents individual line items within a bid, containing detailed information
 * about materials, labor, or services being quoted. Each bid item includes
 * pricing, quantity, and organizational details.
 *
 * @table bid_items
 *
 * @field id - Unique identifier for the bid item (UUID, auto-generated)
 * @field bidId - Foreign key reference to the parent bid (cascading delete)
 * @field itemName - Name/title of the item being bid (max 255 chars)
 * @field description - Detailed description of the item
 * @field quantity - Quantity of the item (decimal with 3 decimal places)
 * @field unitPrice - Price per unit (decimal with 2 decimal places)
 * @field unitType - Type of unit for measurement (enum)
 * @field lineTotal - Total cost for this line item (quantity × unitPrice)
 * @field templateItemId - Optional reference to a template item for consistency
 * @field category - Item category classification (enum)
 * @field sortOrder - Display order within the bid (decimal for flexible positioning)
 * @field notes - Additional notes or comments about the item
 * @field isOptional - Whether this item is optional in the bid
 * @field createdAt - Timestamp when the record was created
 * @field updatedAt - Timestamp when the record was last modified
 *
 * @relationship belongsTo bids via bidId (cascade delete)
 * @relationship belongsTo templateItems via templateItemId (optional)
 */
export const bidItems = pgTable("bid_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  bidId: uuid("bid_id")
    .notNull()
    .references(() => bids.id, { onDelete: "cascade" }),

  // Item Details
  itemName: varchar("item_name", { length: 255 }).notNull(),
  description: text("description"),
  quantity: decimal("quantity", { precision: 10, scale: 3 }).notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  unitType: unitTypeEnum("unit_type").notNull(),
  lineTotal: decimal("line_total", { precision: 12, scale: 2 }).notNull(),

  // Optional reference to template item (for consistency)
  templateItemId: uuid("template_item_id").references(() => templateItems.id),

  // Organization
  category: templateCategoryEnum("category").notNull(),
  sortOrder: decimal("sort_order", { precision: 5, scale: 2 }).default("0"),

  // Additional Fields
  notes: text("notes"),
  isOptional: boolean("is_optional").notNull().default(false),

  // Metadata
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Relations
export const bidTemplatesRelations = relations(bidTemplates, ({ many }) => ({
  templateItems: many(templateItems),
  bids: many(bids),
}));

export const templateItemsRelations = relations(
  templateItems,
  ({ one, many }) => ({
    template: one(bidTemplates, {
      fields: [templateItems.templateId],
      references: [bidTemplates.id],
    }),
    bidItems: many(bidItems),
  })
);

export const bidsRelations = relations(bids, ({ one, many }) => ({
  bidItems: many(bidItems),
  template: one(bidTemplates, {
    fields: [bids.templateId],
    references: [bidTemplates.id],
  }),
  // submittedBidFile: one(files, {
  //   fields: [bids.submittedBidFileId],
  //   references: [files.id],
  // }),
}));

export const bidItemsRelations = relations(bidItems, ({ one }) => ({
  bid: one(bids, {
    fields: [bidItems.bidId],
    references: [bids.id],
  }),
  templateItem: one(templateItems, {
    fields: [bidItems.templateItemId],
    references: [templateItems.id],
  }),
}));

// Types
export type BidTemplateSelect = typeof bidTemplates.$inferSelect;
export type BidTemplateInsert = typeof bidTemplates.$inferInsert;

export type TemplateItemSelect = typeof templateItems.$inferSelect;
export type TemplateItemInsert = typeof templateItems.$inferInsert;

export type BidSelect = typeof bids.$inferSelect;
export type BidInsert = typeof bids.$inferInsert;

export type BidItemSelect = typeof bidItems.$inferSelect;
export type BidItemInsert = typeof bidItems.$inferInsert;

// Utility types for API responses
export type BidWithItems = BidSelect & {
  bidItems: BidItemSelect[];
  template?: BidTemplateSelect;
};

export type TemplateWithItems = BidTemplateSelect & {
  templateItems: TemplateItemSelect[];
};

export type BidItemWithTemplate = BidItemSelect & {
  templateItem?: TemplateItemSelect;
};
