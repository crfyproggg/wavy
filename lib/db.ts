import { PrismaClient } from "@prisma/client";
const g = globalThis as unknown as { p?: PrismaClient };
export const db = g.p ?? (g.p = new PrismaClient());
