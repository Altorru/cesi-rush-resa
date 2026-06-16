"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import SignOutForm from './sign-out-form'
import Logo from './logo'
import { GithubStars } from './github-stars'
import { useUser } from '@/context/UserContext'
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetClose,
   SheetTrigger,
} from '@/components/ui/sheet'
import {
   LayoutDashboard,
   LogIn,
   UserPlus,
   Home,
   Menu,
   X,
} from 'lucide-react'

export default function Navbar() {
   const user = useUser()
   const [open, setOpen] = useState(false)

   const navLinks = user
      ? [
           { href: "/", label: "Accueil", icon: Home },
           { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
        ]
      : [
           { href: "/", label: "Accueil", icon: Home },
           { href: "/sign-in", label: "Connexion", icon: LogIn },
           { href: "/sign-up", label: "S&apos;inscrire", icon: UserPlus },
        ]

   return (
      <header className="sticky top-0 z-40 flex justify-center py-2">
         <div className="container border rounded-md w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
            <nav className="flex items-center justify-between gap-2 sm:gap-6">
               <div className="flex items-center gap-2 sm:gap-6">
                  <Logo />
               </div>

               {/* ── Desktop nav ── */}
               <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                  {user ? (
                     <>
                        <Link href="/dashboard">
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

               {/* ── Mobile burger ── */}
               <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild className="sm:hidden">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                     >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                     </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0 flex flex-col">
                     {/* ── Header ── */}
                     <SheetHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <Logo />
                        <SheetClose asChild>
                           <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                           >
                              <X className="h-5 w-5" />
                              <span className="sr-only">Fermer</span>
                           </Button>
                        </SheetClose>
                     </SheetHeader>

                     {/* ── Nav links ── */}
                     <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                        {navLinks.map((link) => {
                           const Icon = link.icon
                           return (
                              <Link
                                 key={link.href}
                                 href={link.href}
                                 onClick={() => setOpen(false)}
                                 className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
                              >
                                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background">
                                    <Icon className="h-4 w-4" />
                                 </div>
                                 <span>{link.label}</span>
                              </Link>
                           )
                        })}

                        {/* ── Sign Out (mobile, logged in) ── */}
                        {user && (
                           <div className="pt-3 border-t mt-3">
                              <p className="px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                 Session
                              </p>
                              <SignOutForm />
                           </div>
                        )}
                     </div>

                     {/* ── Footer ── */}
                     <div className="border-t px-4 py-4">
                        <GithubStars />
                     </div>
                  </SheetContent>
               </Sheet>
            </nav>
         </div>
      </header>
   )
}
