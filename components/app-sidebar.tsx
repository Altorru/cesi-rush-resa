"use client"

import { LayoutDashboard, Settings } from "lucide-react"
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
} from "@/components/ui/sidebar"
import Logo from "./logo"
import SignOutForm from "./sign-out-form"

const navItems = [
   {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      isActive: (pathname: string) => pathname === "/dashboard",
   },
   {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      isActive: (pathname: string) => pathname.startsWith("/dashboard/settings"),
   },
] as const

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const pathname = usePathname()

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
                           <Link
                              href={item.href}
                              className="flex items-center gap-3"
                           >
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                 <Icon className="h-5 w-5" />
                              </div>
                              <span className="text-sm font-medium">{item.label}</span>
                           </Link>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                  )
               })}
            </SidebarMenu>
         </SidebarContent>
         <SidebarFooter>
            <SignOutForm />
         </SidebarFooter>
         <SidebarRail />
      </Sidebar>
   )
}
