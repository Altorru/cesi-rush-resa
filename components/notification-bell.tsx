"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Bell, CheckCheck, X, Loader, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
   getNotifications,
   markAsRead,
   markAllAsRead,
   dismissNotification,
} from "@/actions/notification-actions"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Notification = {
   id: string
   title: string
   message: string | null
   link: string | null
   createdAt: Date
   seenAt: Date | null
}

export default function NotificationBell() {
   const [open, setOpen] = useState(false)
   const [notifications, setNotifications] = useState<Notification[]>([])
   const [unreadCount, setUnreadCount] = useState(0)
   const [loading, setLoading] = useState(true)
   const dropdownRef = useRef<HTMLDivElement>(null)

   const fetchNotifications = useCallback(async () => {
      setLoading(true)
      const res = await getNotifications()
      if (res.status && res.notifications) {
         setNotifications(res.notifications as Notification[])
         setUnreadCount(res.unreadCount)
      }
      setLoading(false)
   }, [])

   useEffect(() => {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30_000)
      return () => clearInterval(interval)
   }, [fetchNotifications])

   // Close on click outside
   useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
         if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setOpen(false)
         }
      }
      document.addEventListener("mousedown", handler)
      return () => document.removeEventListener("mousedown", handler)
   }, [open])

   const handleMarkAllRead = async () => {
      await markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, seenAt: new Date() })))
      setUnreadCount(0)
   }

   const handleDismiss = async (id: string) => {
      await dismissNotification(id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      setUnreadCount((prev) => Math.max(0, prev - 1))
   }

   const handleClick = async (n: Notification) => {
      if (!n.seenAt) {
         await markAsRead(n.id)
         setNotifications((prev) =>
            prev.map((p) => (p.id === n.id ? { ...p, seenAt: new Date() } : p)),
         )
         setUnreadCount((prev) => Math.max(0, prev - 1))
      }
      setOpen(false)
   }

   const fmt = (d: Date) => {
      const diff = Date.now() - new Date(d).getTime()
      const mins = Math.floor(diff / 60_000)
      if (mins < 1) return "À l'instant"
      if (mins < 60) return `Il y a ${mins} min`
      const hours = Math.floor(mins / 60)
      if (hours < 24) return `Il y a ${hours}h`
      return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" }).format(new Date(d))
   }

   return (
      <div ref={dropdownRef} className="relative">
         <Button
            variant="outline"
            size="icon"
            className="relative h-8 w-8 sm:h-10 sm:w-10"
            onClick={() => setOpen(!open)}
         >
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {unreadCount > 0 && (
               <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
               </span>
            )}
            <span className="sr-only">Notifications</span>
         </Button>

         {open && (
            <div className="absolute right-0 top-full mt-2 z-50 w-[360px] sm:w-[400px] rounded-xl border bg-background shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
               {/* Header */}
               <div className="flex items-center justify-between border-b px-4 py-3">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                     <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1 text-muted-foreground"
                        onClick={handleMarkAllRead}
                     >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Tout lu
                     </Button>
                  )}
               </div>

               {/* List */}
               <div className="max-h-[420px] overflow-y-auto">
                  {loading ? (
                     <div className="flex justify-center py-8">
                        <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
                     </div>
                  ) : notifications.length === 0 ? (
                     <p className="py-8 text-center text-sm text-muted-foreground">
                        Aucune notification
                     </p>
                  ) : (
                     <div className="divide-y">
                        {notifications.map((n) => (
                           <div
                              key={n.id}
                              className={cn(
                                 "group relative flex gap-3 px-4 py-3 transition-colors hover:bg-accent/50",
                                 !n.seenAt && "bg-accent/20",
                              )}
                           >
                              {/* Contenu cliquable */}
                              <div
                                 className="flex-1 min-w-0 cursor-pointer"
                                 onClick={() => handleClick(n)}
                              >
                                 <div className="flex items-start justify-between gap-2">
                                    <p
                                       className={cn(
                                          "text-sm leading-snug",
                                          !n.seenAt && "font-medium",
                                       )}
                                    >
                                       {n.title}
                                    </p>
                                    <span className="shrink-0 text-[11px] text-muted-foreground whitespace-nowrap">
                                       {fmt(n.createdAt)}
                                    </span>
                                 </div>
                                 {n.message && (
                                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                                       {n.message}
                                    </p>
                                 )}
                                 {n.link && (
                                    <Link
                                       href={n.link}
                                       onClick={(e) => e.stopPropagation()}
                                       className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                    >
                                       <ExternalLink className="h-3 w-3" />
                                       Voir
                                    </Link>
                                 )}
                              </div>

                              {/* Dismiss button */}
                              <button
                                 onClick={(e) => {
                                    e.stopPropagation()
                                    handleDismiss(n.id)
                                 }}
                                 className="shrink-0 self-start mt-0.5 rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
                              >
                                 <X className="h-3.5 w-3.5 text-muted-foreground" />
                                 <span className="sr-only">Ignorer</span>
                              </button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   )
}
