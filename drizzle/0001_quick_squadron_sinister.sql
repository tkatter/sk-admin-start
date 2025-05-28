ALTER TABLE "schedule" ADD COLUMN "address" varchar(100);--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "state" varchar(2);--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "zip" varchar(12);--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN "location";