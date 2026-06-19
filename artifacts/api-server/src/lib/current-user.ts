import { pool } from "@workspace/db";

import { ApiError } from "./request";

export type CurrentUser = {
  id: string;
  role: string;
  status: string;
};

export async function requireActiveUser(userId: string): Promise<CurrentUser> {
  const result = await pool.query(
    "select id, role, status from users where id = $1 limit 1",
    [userId],
  );
  const row = result.rows[0] as CurrentUser | undefined;

  if (!row) {
    throw new ApiError(404, "User not found");
  }

  if (row.status !== "active") {
    throw new ApiError(403, "User is not active");
  }

  return row;
}
