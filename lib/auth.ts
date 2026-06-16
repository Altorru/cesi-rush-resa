import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins";
import prisma from "./prisma";

export const auth = betterAuth({
   database: prismaAdapter(prisma, {
      provider: "postgresql"
   }),
   emailAndPassword: {
      enabled: true,
      autoSignIn: false
   },
   plugins: [
      twoFactor({
         issuer: "Better Auth Starter",
      }),
   ],
   rateLimit: {
      window: 60, // time window in seconds
      max: 10,
   },
})