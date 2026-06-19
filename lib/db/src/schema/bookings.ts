import { createInsertSchema } from "drizzle-zod";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod";

import { providerProfilesTable } from "./providers";
import { usersTable } from "./users";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
]);

export const bookingTypeEnum = pgEnum("booking_type", ["home", "online"]);

export const bookingsTable = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientUserId: uuid("patient_user_id").notNull().references(() => usersTable.id),
  providerProfileId: uuid("provider_profile_id").references(() => providerProfilesTable.id),
  providerNameSnapshot: text("provider_name_snapshot").notNull(),
  specialtySnapshot: text("specialty_snapshot").notNull(),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }).notNull(),
  status: bookingStatusEnum("status").notNull().default("pending"),
  type: bookingTypeEnum("type").notNull().default("home"),
  address: text("address"),
  notes: text("notes"),
  priceMinor: integer("price_minor").notNull().default(0),
  currency: text("currency").notNull().default("SDG"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
