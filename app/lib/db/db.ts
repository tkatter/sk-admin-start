import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as scheduleSchema from "~/lib/db/schema/schedule";
import * as bidSchema from "~/lib/db/schema/bid";
import * as authSchema from "~/lib/db/schema/auth";

const sql = neon(process.env.DATABASE_URL!);

// export const db = drizzle(process.env.DATABASE_URL!);
export const db = drizzle({
  client: sql,
  schema: { ...scheduleSchema, ...bidSchema, ...authSchema },
});
