import type { IncomingMessage, ServerResponse } from "http";
import { ZodError, type ZodSchema } from "zod";

export class HttpError extends Error {
  constructor(readonly status: number, message: string, readonly details?: unknown) {
    super(message);
    this.name = "HttpError";
  }
}

export function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

export async function readJson<T>(req: IncomingMessage, schema: ZodSchema<T>): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf-8").trim();
  return schema.parse(raw ? JSON.parse(raw) : {});
}

export function getHeader(req: IncomingMessage, name: string): string | null {
  const value = req.headers[name.toLowerCase()];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export function requireUserId(req: IncomingMessage): string {
  const userId = getHeader(req, "x-user-id");
  if (!userId) throw new HttpError(401, "Missing x-user-id header");
  return userId;
}

export function handleError(res: ServerResponse, error: unknown): void {
  if (error instanceof HttpError) {
    sendJson(res, error.status, { error: { message: error.message, details: error.details } });
    return;
  }
  if (error instanceof ZodError) {
    sendJson(res, 400, { error: { message: "Invalid request body", details: error.flatten() } });
    return;
  }
  if (error instanceof SyntaxError) {
    sendJson(res, 400, { error: { message: "Malformed JSON body" } });
    return;
  }
  console.error(error);
  sendJson(res, 500, { error: { message: "Internal server error" } });
}
