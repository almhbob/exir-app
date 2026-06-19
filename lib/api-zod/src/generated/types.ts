import type { z } from "zod";

import { HealthCheckResponse } from "./api";

export type HealthStatus = z.infer<typeof HealthCheckResponse>;
