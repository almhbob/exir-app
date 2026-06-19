import type { Request } from "express";

export class ApiError extends Error {
  constructor(readonly statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export function requireString(
  value: unknown,
  fieldName: string,
  options: { min?: number; max?: number } = {},
): string {
  if (typeof value !== "string") {
    throw new ApiError(400, `${fieldName} must be a string`);
  }

  const trimmed = value.trim();
  const min = options.min ?? 1;
  const max = options.max ?? 500;

  if (trimmed.length < min) {
    throw new ApiError(400, `${fieldName} is too short`);
  }

  if (trimmed.length > max) {
    throw new ApiError(400, `${fieldName} is too long`);
  }

  return trimmed;
}

export function optionalString(
  value: unknown,
  fieldName: string,
  options: { max?: number } = {},
): string | null {
  if (value == null || value === "") return null;
  return requireString(value, fieldName, { min: 0, max: options.max ?? 500 });
}

export function optionalInt(
  value: unknown,
  fieldName: string,
  options: { min?: number; max?: number } = {},
): number | null {
  if (value == null || value === "") return null;

  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(numberValue)) {
    throw new ApiError(400, `${fieldName} must be an integer`);
  }

  const min = options.min ?? Number.MIN_SAFE_INTEGER;
  const max = options.max ?? Number.MAX_SAFE_INTEGER;
  if (numberValue < min || numberValue > max) {
    throw new ApiError(400, `${fieldName} is out of range`);
  }

  return numberValue;
}

export function requireUserId(req: Request): string {
  const userId = req.header("x-user-id");
  if (!userId) {
    throw new ApiError(401, "Missing user id header");
  }
  return userId;
}
