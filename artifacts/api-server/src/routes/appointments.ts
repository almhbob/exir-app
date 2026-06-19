import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

import { requireActiveUser } from "../lib/current-user";
import {
  optionalInt,
  optionalString,
  requireString,
  requireUserId,
} from "../lib/request";

const router: IRouter = Router();

router.post("/bookings", async (req, res) => {
  const userId = requireUserId(req);
  await requireActiveUser(userId);

  const type = req.body.type === "online" ? "online" : "home";

  const result = await pool.query(
    `insert into bookings
       (patient_user_id, provider_profile_id, provider_name_snapshot, specialty_snapshot,
        scheduled_for, status, type, address, notes, price_minor, currency)
     values ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9, $10)
     returning *`,
    [
      userId,
      optionalString(req.body.providerProfileId, "providerProfileId", { max: 80 }),
      requireString(req.body.providerNameSnapshot, "providerNameSnapshot", { min: 2, max: 160 }),
      requireString(req.body.specialtySnapshot, "specialtySnapshot", { min: 2, max: 120 }),
      requireString(req.body.scheduledFor, "scheduledFor", { min: 10, max: 80 }),
      type,
      optionalString(req.body.address, "address", { max: 300 }),
      optionalString(req.body.notes, "notes", { max: 1000 }),
      optionalInt(req.body.priceMinor, "priceMinor", { min: 0 }) ?? 0,
      optionalString(req.body.currency, "currency", { max: 8 }) ?? "SDG",
    ],
  );

  res.status(201).json({ booking: result.rows[0] });
});

router.get("/bookings", async (req, res) => {
  const userId = requireUserId(req);
  await requireActiveUser(userId);

  const result = await pool.query(
    `select * from bookings where patient_user_id = $1 order by scheduled_for desc limit 100`,
    [userId],
  );

  res.json({ bookings: result.rows });
});

export default router;
