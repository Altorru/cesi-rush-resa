"use client"

import { CalendarCheck, HardHat, LayoutDashboard, Settings, Shield, ListChecks } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarRail,
   SidebarSeparator,
} from "@/components/ui/sidebar"
import Logo from "./logo"
import SignOutForm from "./sign-out-form"
import { useUser } from "@/context/UserContext"

const navItems = [
   {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      isActive: (pathname: string) => pathname === "/dashboard",
   },
   {
      href: "/materiel",
      label: "Matériel",
      icon: HardHat,
      isActive: (pathname: string) => pathname === "/materiel" || pathname.startsWith("/materiel/"),
   },
   {
      href: "/dashboard/reservations",
      label: "Mes réservations",
      icon: CalendarCheck,
      isActive: (pathname: string) => pathname.startsWith("/dashboard/reservations"),
   },
   {
      href: "/dashboard/settings",
      label: "Paramètres",
      icon: Settings,
      isActive: (pathname: string) => pathname.startsWith("/dashboard/settings"),
   },
] as const

const adminItems = [
   {
      href: "/dashboard/admin",
      label: "Administration",
      icon: Shield,
      isActive: (pathname: string) => pathname === "/dashboard/admin",
   },
   {
      href: "/dashboard/admin/reservations",
      label: "Gestion réservations",
      icon: ListChecks,
      isActive: (pathname: string) => pathname.startsWith("/dashboard/admin/reservations"),
   },
] as const

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const pathname = usePathname()
   const user = useUser()
   const isAdmin = user?.role === "admin"

   return (
      <Sidebar collapsible="offcanvas" {...props}>
         <SidebarHeader className="flex items-center">
            <Logo />
         </SidebarHeader>
         <SidebarContent>
            <SidebarMenu className="px-2 py-4">
               {navItems.map((item) => {
                  const active = item.isActive(pathname)
                  const Icon = item.icon
                  return (
                     <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={active} size="lg">
                           <Link href={item.href} className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                 <Icon className="h-5 w-5" />
                              </div>
                              <span className="text-sm font-medium">{item.label}</span>
                           </Link>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                  )
               })}

               {isAdmin && (
                  <>
                     <SidebarSeparator className="my-2" />
                     {adminItems.map((item) => {
                        const active = item.isActive(pathname)
                        const Icon = item.icon
                        return (
                           <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton asChild isActive={active} size="lg">
                                 <Link href={item.href} className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-500/10">
                                       <Icon className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <span className="text-sm font-medium">{item.label}</span>
                                 </Link>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        )
                     })}
                  </>
               )}
            </SidebarMenu>
         </SidebarContent>
         <SidebarFooter>
            <SignOutForm />
         </SidebarFooter>
         <SidebarRail />
      </Sidebar>
   )
}
