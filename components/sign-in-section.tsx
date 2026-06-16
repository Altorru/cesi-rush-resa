"use client"

import Logo from "@/components/logo"
import SignInForm from "@/components/sign-in-form"
import Link from "next/link"

export default function SignInSection() {
   return (
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6">
         <div className="flex flex-1 flex-col justify-center py-8 sm:py-10 max-w-md">
            <div className="w-full">
               <div className="flex items-center">
                  <Logo />
               </div>
               <h3 className="mt-6 text-lg font-semibold text-foreground dark:text-foreground">
                  Connectez-vous à votre compte
               </h3>
               <p className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground">
                  Vous n&apos;avez pas de compte ?{" "}
                  <Link
                     href="/sign-up"
                     className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
                  >
                     S&apos;inscrire
                  </Link>
               </p>
               <SignInForm />

               <p className="pt-3 text-sm text-muted-foreground">
                  En continuant, vous acceptez nos{" "}
                  <Link
                     href="#"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Conditions d&apos;utilisation
                  </Link>{" "}
                  and{" "}
                  <Link
                     href="#"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Politique de confidentialité
                  </Link>
                  .
               </p>
            </div>
         </div>
      </div>
   )
}
