CREATE TYPE "public"."bid_status" AS ENUM('draft', 'submitted', 'accepted', 'rejected', 'in_review');--> statement-breakpoint
CREATE TYPE "public"."template_category" AS ENUM('framing', 'finishing', 'installation', 'demolition', 'electrical', 'plumbing', 'materials', 'labor', 'permits', 'cleanup', 'other');--> statement-breakpoint
CREATE TYPE "public"."unit_type" AS ENUM('sq_ft', 'linear_ft', 'each', 'hour', 'cu_ft', 'day', 'lump_sum');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('job', 'meeting', 'event', 'appointment');--> statement-breakpoint
ALTER TYPE "public"."status" ADD VALUE 'completed';--> statement-breakpoint
ALTER TYPE "public"."status" ADD VALUE 'cancelled';--> statement-breakpoint
CREATE TABLE "bid_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bid_id" uuid NOT NULL,
	"item_name" varchar(255) NOT NULL,
	"description" text,
	"quantity" numeric(10, 3) NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"unit_type" "unit_type" NOT NULL,
	"line_total" numeric(12, 2) NOT NULL,
	"template_item_id" uuid,
	"category" "template_category" NOT NULL,
	"sort_order" numeric(5, 2) DEFAULT '0',
	"notes" text,
	"is_optional" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bid_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bids" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jobName" varchar(255) NOT NULL,
	"status" "bid_status" DEFAULT 'draft' NOT NULL,
	"builderClientName" varchar(255) NOT NULL,
	"contact_phone" varchar(20),
	"contact_email" varchar(255),
	"job_location" json,
	"project_start_date" timestamp,
	"project_end_date" timestamp,
	"project_description" text,
	"subtotal" numeric(12, 2) DEFAULT '0' NOT NULL,
	"tax_rate" numeric(5, 4) DEFAULT '0',
	"tax_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"template_id" uuid,
	"notes" text,
	"private_notes" text,
	"bid_valid_until" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"item_name" varchar(255) NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"unit_type" "unit_type" NOT NULL,
	"category" "template_category" NOT NULL,
	"description" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"sort_order" numeric(5, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "schedule" ALTER COLUMN "start_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "schedule" ALTER COLUMN "start_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "schedule" ALTER COLUMN "end_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "schedule" ALTER COLUMN "end_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "schedule" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "schedule" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "event_type" "event_type" DEFAULT 'job' NOT NULL;--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "location" json;--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "bid_id" uuid;--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "bid_items" ADD CONSTRAINT "bid_items_bid_id_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "public"."bids"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bid_items" ADD CONSTRAINT "bid_items_template_item_id_template_items_id_fk" FOREIGN KEY ("template_item_id") REFERENCES "public"."template_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_template_id_bid_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."bid_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_items" ADD CONSTRAINT "template_items_template_id_bid_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."bid_templates"("id") ON DELETE cascade ON UPDATE no action;