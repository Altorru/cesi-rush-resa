import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL;

const prismaClientSingleton = () => {
   return new PrismaClient(
      databaseUrl
         ? {
              datasources: {
                 db: { url: databaseUrl },
              },
           }
         : undefined,
   );
};

declare const globalThis: {
   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export default prisma;

