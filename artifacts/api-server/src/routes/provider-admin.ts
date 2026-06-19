import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

import { requireActiveUser } from "../lib/current-user";
import { ApiError, optionalString, requireString, requireUserId } from "../lib/request";

const router: IRouter = Router();

function requireAdmin(role: string): void {
  if (role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
}

function parseReviewStatus(value: unknown): "approved" | "rejected" {
  if (value === "approved" || value === "rejected") return value;
  throw new ApiError(400, "status must be approved or rejected");
}

router.patch("/provider-applications/:id/review", async (req, res) => {
  const reviewerId = requireUserId(req);
  const reviewer = await requireActiveUser(reviewerId);
  requireAdmin(reviewer.role);

  const applicationId = requireString(req.params.id, "id", { min: 10, max: 80 });
  const status = parseReviewStatus(req.body.status);
  const rejectionReason =
    status === "rejected"
      ? optionalString(req.body.rejectionReason, "rejectionReason", { max: 500 })
      : null;

  const client = await pool.connect();

  try {
    await client.query("begin");

    const updated = await client.query(
      `update provider_applications
       set status = $1,
           rejection_reason = $2,
           reviewed_by_user_id = $3,
           reviewed_at = now(),
           updated_at = now()
       where id = $4
         and status = 'pending_review'
       returning *`,
      [status, rejectionReason, reviewerId, applicationId],
    );

    const application = updated.rows[0];
    if (!application) {
      throw new ApiError(404, "Pending provider application not found");
    }

    if (status === "approved") {
      await client.query(
        `update users set role = 'doctor', updated_at = now() where id = $1`,
        [application.user_id],
      );

      await client.query(
        `insert into provider_profiles
           (user_id, application_id, display_name, specialty, city, languages, certifications, price_minor, currency)
         select
           a.user_id,
           a.id,
           u.full_name,
           a.specialty,
           a.city,
           '["العربية"]'::jsonb,
           '[]'::jsonb,
           0,
           'SDG'
         from provider_applications a
         join users u on u.id = a.user_id
         where a.id = $1
           and not exists (
             select 1 from provider_profiles p where p.application_id = a.id
           )`,
        [applicationId],
      );
    }

    await client.query("commit");
    res.json({ application });
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
});

export default router;
