import { BigGoJWTClientInitialParams } from "@funmula/api-core/lib/auth/jwt/types";

export type BigGoJwtInitParam = Omit<BigGoJWTClientInitialParams, "hostname" | "authHostname">