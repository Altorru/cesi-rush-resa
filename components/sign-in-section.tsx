"use client"

import Logo from "@/components/logo"
import SignInForm from "@/components/sign-in-form"
import Link from "next/link"

export default function SignInSection() {
   return (
      <div className="flex items-center justify-center min-h-screen">
         <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
               <div className="flex items-center">
                  <Logo />
               </div>
               <h3 className="mt-6 text-lg font-semibold text-foreground dark:text-foreground">
                  Sign in to your account
               </h3>
               <p className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                     href="/sign-up"
                     className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
                  >
                     Sign Up
                  </Link>
               </p>
               <SignInForm />

               <p className="pt-3 text-sm text-muted-foreground">
                  By continue, you agree to our{" "}
                  <Link
                     href="#"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                     href="#"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Privacy Policy
                  </Link>
                  .
               </p>
            </div>
         </div>
      </div>
   )
}
