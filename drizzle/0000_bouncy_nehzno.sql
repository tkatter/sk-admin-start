CREATE TYPE "public"."status" AS ENUM('pending', 'confirmed', 'in-progress');--> statement-breakpoint
CREATE TABLE "schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"start_date" date DEFAULT now() NOT NULL,
	"end_date" date DEFAULT now() NOT NULL,
	"status" "status",
	"location" json DEFAULT '{"address":"14120 269th Ave NW","city":"Zimmerman","state":"MN","zip":"55398"}'::json
);
