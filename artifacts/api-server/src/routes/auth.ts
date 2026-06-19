import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

import { ApiError, requireString } from "../lib/request";

const router: IRouter = Router();

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

function demoAuthEnabled(): boolean {
  return (
    process.env.ENABLE_DEMO_AUTH === "true" ||
    process.env.EXPO_PUBLIC_ENABLE_DEMO_AUTH === "true" ||
    process.env.NODE_ENV !== "production"
  );
}

router.post("/auth/demo-login", async (req, res) => {
  if (!demoAuthEnabled()) {
    throw new ApiError(403, "Demo auth is disabled");
  }

  const phone = requireString(req.body.phone, "phone", { min: 6, max: 32 });
  const fullName = req.body.fullName
    ? requireString(req.body.fullName, "fullName", { min: 2, max: 120 })
    : "مستخدم إكسير";
  const role = ["patient", "doctor", "admin"].includes(req.body.role)
    ? req.body.role
    : "patient";

  const result = await pool.query(
    `insert into users (phone, full_name, role, status, is_phone_verified)
     values ($1, $2, $3, 'active', true)
     on conflict (phone) do update set
       full_name = excluded.full_name,
       role = excluded.role,
       status = 'active',
       is_phone_verified = true,
       updated_at = now()
     returning id, phone, email, full_name, role, status, is_phone_verified, created_at, updated_at`,
    [phone, fullName, role],
  );

  const row = result.rows[0] as UserRow | undefined;
  if (!row) throw new ApiError(500, "Could not create user");

  res.json({ user: mapUser(row) });
});

export default router;
