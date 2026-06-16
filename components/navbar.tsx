"use client"

import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import SignOutForm from './sign-out-form'
import Logo from './logo'
import { GithubStars } from './github-stars'
import { useUser } from '@/context/UserContext'

export default function Navbar() {
   const user = useUser();
   return (
      <header className="sticky top-0 z-100 flex justify-center py-2">
         <div className="container border rounded-md w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
            <nav className="flex items-center justify-between gap-2 sm:gap-6">
               <div className="flex items-center gap-2 sm:gap-6">
                  <Logo />
               </div>
               <div className='flex items-center gap-1 sm:gap-2'>
                  <Link href="/materiel">
                     <Button variant="ghost" size="sm" className="text-xs sm:text-sm sm:h-9">
                        Matériel
                     </Button>
                  </Link>
                  {user ? (
                     <>
                        <Link
                           href="/dashboard"
                        >
                           <Button variant="outline" size="sm" className="text-xs sm:text-sm sm:h-9">
                              Tableau de bord
                           </Button>
                        </Link>
                        <SignOutForm />
                     </>
                  ) : (
                     <>
                        <Link href="/sign-in">
                           <Button variant="outline" size="sm" className="text-xs sm:text-sm sm:h-9">
                              Connexion
                           </Button>
                        </Link>
                        <Button asChild size="sm" className="text-xs sm:text-sm sm:h-9">
                           <Link href="/sign-up">S&apos;inscrire</Link>
                        </Button>
                     </>
                  )}
                  <GithubStars />
               </div>
            </nav>
         </div>
      </header>
   )
}
