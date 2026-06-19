import { pool } from "@workspace/db";

export async function one<T>(statement: string, values: unknown[] = []): Promise<T | null> {
  const result = await pool.query(statement, values);
  const first = result.rows[0] as T | undefined;
  return first ?? null;
}

export async function many<T>(statement: string, values: unknown[] = []): Promise<T[]> {
  const result = await pool.query(statement, values);
  return result.rows as T[];
}
