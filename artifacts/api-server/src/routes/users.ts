import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

import { ApiError, requireUserId } from "../lib/request";

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

router.get("/users/me", async (req, res) => {
  const userId = requireUserId(req);
  const result = await pool.query<UserRow>(
    `select id, phone, email, full_name, role, status, is_phone_verified, created_at, updated_at
     from users where id = $1 limit 1`,
    [userId],
  );

  const row = result.rows[0];
  if (!row) throw new ApiError(404, "User not found");

  res.json({ user: mapUser(row) });
});

export default router;
