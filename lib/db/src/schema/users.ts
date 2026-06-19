import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["patient", "doctor", "admin"]);
export const accountStatusEnum = pgEnum("account_status", [
  "active",
  "disabled",
  "pending_verification",
]);

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").notNull().unique(),
  email: text("email").unique(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default("patient"),
  status: accountStatusEnum("status").notNull().default("pending_verification"),
  avatarUrl: text("avatar_url"),
  avatarPublicId: text("avatar_public_id"),
  isPhoneVerified: boolean("is_phone_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const patientProfilesTable = pgTable("patient_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  address: text("address"),
  city: text("city"),
  bloodType: text("blood_type"),
  age: text("age"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertPatientProfileSchema = createInsertSchema(patientProfilesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
export type InsertPatientProfile = z.infer<typeof insertPatientProfileSchema>;
export type PatientProfile = typeof patientProfilesTable.$inferSelect;
