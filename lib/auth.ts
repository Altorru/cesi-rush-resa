import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor, admin } from "better-auth/plugins";
import prisma from "./prisma";
import { ac, roles } from "./permissions";

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
      admin({
         ac,
         roles,
      }),
   ],
   user: {
      additionalFields: {
         role: {
            type: "string",
            required: false,
            defaultValue: "user",
            input: false,
         },
      },
   },
   rateLimit: {
      window: 60,
      max: 10,
   },
   baseURL: process.env.BETTER_AUTH_URL!,
})