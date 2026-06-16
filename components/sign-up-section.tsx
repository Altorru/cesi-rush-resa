"use client"

import Logo from "@/components/logo"
import Link from "next/link"
import SignUpForm from "./sign-up-form"

export default function SignUpSection() {
   return (
      <div className="flex items-center justify-center min-h-screen">
         <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
               <div className="flex items-center">
                  <Logo />
               </div>
               <h3 className="mt-6 text-lg font-semibold text-foreground dark:text-foreground">
                  Entrez vos informations ci-dessous pour créer un compte
               </h3>
               <p className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground">
                  Vous avez déjà un compte ?{" "}
                  <Link
                     href="/sign-in"
                     className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
                  >
                     Se connecter
                  </Link>
               </p>
               <SignUpForm />

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
