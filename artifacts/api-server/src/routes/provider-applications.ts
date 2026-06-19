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

type RawDocument = {
  name?: unknown;
  url?: unknown;
  publicId?: unknown;
  uploadedAt?: unknown;
};

function asRawDocument(value: unknown): RawDocument {
  return value && typeof value === "object" ? (value as RawDocument) : {};
}

function parseDocuments(value: unknown): unknown[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    const doc = asRawDocument(item);
    return {
      name: typeof doc.name === "string" ? doc.name : "document",
      url: typeof doc.url === "string" ? doc.url : "",
      publicId: typeof doc.publicId === "string" ? doc.publicId : "",
      uploadedAt:
        typeof doc.uploadedAt === "string" ? doc.uploadedAt : new Date().toISOString(),
    };
  });
}

router.post("/provider-applications", async (req, res) => {
  const userId = requireUserId(req);
  await requireActiveUser(userId);

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
  await requireActiveUser(userId);

  const result = await pool.query(
    `select * from provider_applications where user_id = $1 order by submitted_at desc limit 50`,
    [userId],
  );

  res.json({ applications: result.rows });
});

export default router;
