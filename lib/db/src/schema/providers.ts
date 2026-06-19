import { createInsertSchema } from "drizzle-zod";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod";

import { usersTable } from "./users";

export const providerApplicationStatusEnum = pgEnum("provider_application_status", [
  "draft",
  "pending_review",
  "approved",
  "rejected",
]);

export type ProviderDocument = {
  name: string;
  url: string;
  publicId: string;
  uploadedAt: string;
};

export const providerApplicationsTable = pgTable("provider_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  specialty: text("specialty").notNull(),
  licenseNumber: text("license_number").notNull(),
  licenseAuthority: text("license_authority"),
  experienceYears: integer("experience_years"),
  city: text("city"),
  nationalIdMasked: text("national_id_masked"),
  documents: jsonb("documents").$type<ProviderDocument[]>(),
  signedName: text("signed_name"),
  status: providerApplicationStatusEnum("status").notNull().default("pending_review"),
  rejectionReason: text("rejection_reason"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewedByUserId: uuid("reviewed_by_user_id").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const providerProfilesTable = pgTable("provider_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  applicationId: uuid("application_id").references(() => providerApplicationsTable.id),
  displayName: text("display_name").notNull(),
  specialty: text("specialty").notNull(),
  bio: text("bio"),
  city: text("city"),
  languages: jsonb("languages").$type<string[]>(),
  certifications: jsonb("certifications").$type<string[]>(),
  priceMinor: integer("price_minor").notNull().default(0),
  currency: text("currency").notNull().default("SDG"),
  ratingAverage: integer("rating_average").notNull().default(0),
  ratingCount: integer("rating_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProviderApplicationSchema = createInsertSchema(providerApplicationsTable).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
  reviewedByUserId: true,
  createdAt: true,
  updatedAt: true,
});
export const insertProviderProfileSchema = createInsertSchema(providerProfilesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProviderApplication = z.infer<typeof insertProviderApplicationSchema>;
export type ProviderApplication = typeof providerApplicationsTable.$inferSelect;
export type InsertProviderProfile = z.infer<typeof insertProviderProfileSchema>;
export type ProviderProfile = typeof providerProfilesTable.$inferSelect;
