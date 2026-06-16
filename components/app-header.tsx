"use client"

import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { User } from "@/lib/types"
import { Separator } from "./ui/separator"
import NotificationBell from "./notification-bell"

type UserProps = {
   user: User | null
}

export default function AppHeader({ user }: UserProps) {
   return (
      <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b px-3 sm:px-6">
         <SidebarTrigger />
         <Separator
            orientation="vertical"
            className="mx-1 sm:mx-2 data-[orientation=vertical]:h-4"
         />
         <div className="flex flex-1 items-center justify-between min-w-0">
            <h1 className="text-base sm:text-xl font-semibold truncate">Bonjour, {user?.name} 👋</h1>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
               <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                  <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="sr-only">Rechercher</span>
               </Button>
               <NotificationBell />
            </div>
         </div>
      </header>
   )
}
