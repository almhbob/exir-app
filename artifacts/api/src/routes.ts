import type { IncomingMessage, ServerResponse } from "http";
import { z } from "zod";

import { many, one } from "./db";
import { HttpError, readJson, requireUserId, sendJson } from "./http";

const roleSchema = z.enum(["patient", "doctor", "admin"]);

const demoLoginSchema = z.object({
  phone: z.string().min(6).max(32),
  fullName: z.string().min(2).max(120).default("مستخدم إكسير"),
  role: roleSchema.default("patient"),
});

const providerApplicationSchema = z.object({
  specialty: z.string().min(2).max(120),
  licenseNumber: z.string().min(3).max(120),
  licenseAuthority: z.string().max(160).optional(),
  experienceYears: z.number().int().min(0).max(80).optional(),
  city: z.string().max(120).optional(),
  nationalIdMasked: z.string().max(80).optional(),
  signedName: z.string().min(2).max(120).optional(),
  documents: z
    .array(
      z.object({
        name: z.string().min(1),
        url: z.string().url(),
        publicId: z.string().min(1),
        uploadedAt: z.string().min(1),
      }),
    )
    .default([]),
});

const bookingSchema = z.object({
  providerProfileId: z.string().uuid().optional(),
  providerNameSnapshot: z.string().min(2).max(160),
  specialtySnapshot: z.string().min(2).max(120),
  scheduledFor: z.string().datetime(),
  type: z.enum(["home", "online"]).default("home"),
  address: z.string().max(300).optional(),
  notes: z.string().max(1000).optional(),
  priceMinor: z.number().int().min(0).default(0),
  currency: z.string().min(3).max(8).default("SDG"),
});

type UserRow = {
  id: string;
  phone: string;
  email: string | null;
  full_name: string;
  role: string;
  status: string;
  is_phone_verified: boolean;
  created_at: Date;
  updated_at: Date;
};

function mapUser(row: UserRow) {
  return {
    id: row.id,
    phone: row.phone,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    status: row.status,
    isPhoneVerified: row.is_phone_verified,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function isDemoAuthEnabled(): boolean {
  return (
    process.env.ENABLE_DEMO_AUTH === "true" ||
    process.env.EXPO_PUBLIC_ENABLE_DEMO_AUTH === "true" ||
    process.env.NODE_ENV !== "production"
  );
}

async function health(_req: IncomingMessage, res: ServerResponse) {
  await one("select 1 as ok");
  sendJson(res, 200, { status: "ok", database: "ok" });
}

async function demoLogin(req: IncomingMessage, res: ServerResponse) {
  if (!isDemoAuthEnabled()) {
    throw new HttpError(403, "Demo auth is disabled");
  }

  const body = await readJson(req, demoLoginSchema);
  const row = await one<UserRow>(
    `insert into users (phone, full_name, role, status, is_phone_verified)
     values ($1, $2, $3, 'active', true)
     on conflict (phone) do update set
       full_name = excluded.full_name,
       role = excluded.role,
       status = 'active',
       is_phone_verified = true,
       updated_at = now()
     returning id, phone, email, full_name, role, status, is_phone_verified, created_at, updated_at`,
    [body.phone, body.fullName, body.role],
  );

  if (!row) throw new HttpError(500, "Could not create demo user");
  sendJson(res, 200, { user: mapUser(row) });
}

async function currentUser(req: IncomingMessage, res: ServerResponse) {
  const userId = requireUserId(req);
  const row = await one<UserRow>(
    `select id, phone, email, full_name, role, status, is_phone_verified, created_at, updated_at
     from users where id = $1 limit 1`,
    [userId],
  );

  if (!row) throw new HttpError(404, "User not found");
  sendJson(res, 200, { user: mapUser(row) });
}

async function createProviderApplication(req: IncomingMessage, res: ServerResponse) {
  const userId = requireUserId(req);
  const body = await readJson(req, providerApplicationSchema);

  const row = await one(
    `insert into provider_applications
       (user_id, specialty, license_number, license_authority, experience_years, city,
        national_id_masked, documents, signed_name, status)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending_review')
     returning *`,
    [
      userId,
      body.specialty,
      body.licenseNumber,
      body.licenseAuthority ?? null,
      body.experienceYears ?? null,
      body.city ?? null,
      body.nationalIdMasked ?? null,
      JSON.stringify(body.documents),
      body.signedName ?? null,
    ],
  );

  sendJson(res, 201, { application: row });
}

async function listProviderApplications(req: IncomingMessage, res: ServerResponse) {
  const userId = requireUserId(req);
  const rows = await many(
    `select * from provider_applications where user_id = $1 order by submitted_at desc limit 50`,
    [userId],
  );
  sendJson(res, 200, { applications: rows });
}

async function createBooking(req: IncomingMessage, res: ServerResponse) {
  const userId = requireUserId(req);
  const body = await readJson(req, bookingSchema);

  const row = await one(
    `insert into bookings
       (patient_user_id, provider_profile_id, provider_name_snapshot, specialty_snapshot,
        scheduled_for, status, type, address, notes, price_minor, currency)
     values ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9, $10)
     returning *`,
    [
      userId,
      body.providerProfileId ?? null,
      body.providerNameSnapshot,
      body.specialtySnapshot,
      body.scheduledFor,
      body.type,
      body.address ?? null,
      body.notes ?? null,
      body.priceMinor,
      body.currency,
    ],
  );

  sendJson(res, 201, { booking: row });
}

async function listBookings(req: IncomingMessage, res: ServerResponse) {
  const userId = requireUserId(req);
  const rows = await many(
    `select * from bookings where patient_user_id = $1 order by scheduled_for desc limit 100`,
    [userId],
  );
  sendJson(res, 200, { bookings: rows });
}

export async function route(req: IncomingMessage, res: ServerResponse, url: URL) {
  const method = req.method ?? "GET";
  const pathname = url.pathname;

  if (method === "GET" && pathname === "/api/healthz") return health(req, res);
  if (method === "POST" && pathname === "/api/auth/demo-login") return demoLogin(req, res);
  if (method === "GET" && pathname === "/api/users/me") return currentUser(req, res);
  if (method === "POST" && pathname === "/api/provider-applications") return createProviderApplication(req, res);
  if (method === "GET" && pathname === "/api/provider-applications") return listProviderApplications(req, res);
  if (method === "POST" && pathname === "/api/bookings") return createBooking(req, res);
  if (method === "GET" && pathname === "/api/bookings") return listBookings(req, res);

  throw new HttpError(404, "Route not found");
}
