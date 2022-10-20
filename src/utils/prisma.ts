import { PrismaClient } from "@prisma/client";

// next dev clears cache which instantiates a new prisma client on hot reload. save on global object if dev
export const prisma: PrismaClient =
  (global as any).prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") (global as any).prisma = prisma;
