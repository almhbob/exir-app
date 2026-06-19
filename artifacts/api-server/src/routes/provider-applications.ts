import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

import {
  optionalInt,
  optionalString,
  requireString,
  requireUserId,
} from "../lib/request";

const router: IRouter = Router();

function parseDocuments(value: unknown): unknown[] {
  if (value == null) return [];
  if (!Array.isArray(value)) return [];
  return value.map((item) => ({
    name: typeof item?.name === "string" ? item.name : "document",
    url: typeof item?.url === "string" ? item.url : "",
    publicId: typeof item?.publicId === "string" ? item.publicId : "",
    uploadedAt: typeof item?.uploadedAt === "string" ? item.uploadedAt : new Date().toISOString(),
  }));
}

router.post("/provider-applications", async (req, res) => {
  const userId = requireUserId(req);
  const specialty = requireString(req.body.specialty, "specialty", { min: 2, max: 120 });
  const licenseNumber = requireString(req.body.licenseNumber, "licenseNumber", {
    min: 3,
    max: 120,
  });

  const result = await pool.query(
    `insert into provider_applications
       (user_id, specialty, license_number, license_authority, experience_years, city,
        national_id_masked, documents, signed_name, status)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending_review')
     returning *`,
    [
      userId,
      specialty,
      licenseNumber,
      optionalString(req.body.licenseAuthority, "licenseAuthority", { max: 160 }),
      optionalInt(req.body.experienceYears, "experienceYears", { min: 0, max: 80 }),
      optionalString(req.body.city, "city", { max: 120 }),
      optionalString(req.body.nationalIdMasked, "nationalIdMasked", { max: 80 }),
      JSON.stringify(parseDocuments(req.body.documents)),
      optionalString(req.body.signedName, "signedName", { max: 120 }),
    ],
  );

  res.status(201).json({ application: result.rows[0] });
});

router.get("/provider-applications", async (req, res) => {
  const userId = requireUserId(req);
  const result = await pool.query(
    `select * from provider_applications where user_id = $1 order by submitted_at desc limit 50`,
    [userId],
  );

  res.json({ applications: result.rows });
});

export default router;
