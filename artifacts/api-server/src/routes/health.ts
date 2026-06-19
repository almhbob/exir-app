import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
  await pool.query("select 1 as ok");
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

export default router;
