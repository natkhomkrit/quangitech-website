import { PrismaClient } from "@/generated/prisma";

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: ["query"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

prisma = global.prisma;

export default prisma;
