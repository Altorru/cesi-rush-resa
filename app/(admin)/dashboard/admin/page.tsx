import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HardHat, CalendarCheck, Users, AlertCircle } from "lucide-react"

export default async function AdminPage() {
   const session = await auth.api.getSession({ headers: await headers() })

   if (!session || session.user.role !== "admin") {
      return redirect("/dashboard")
   }

   const [
      equipmentCount,
      reservationCount,
      pendingCount,
      userCount,
      recentReservations,
   ] = await Promise.all([
      prisma.equipment.count(),
      prisma.reservation.count(),
      prisma.reservation.count({ where: { status: "pending" } }),
      prisma.user.count(),
      prisma.reservation.findMany({
         take: 5,
         orderBy: { createdAt: "desc" },
         include: { equipment: true, user: { select: { name: true, email: true } } },
      }),
   ])

   const fmt = (d: Date) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(d)
   const statusLabel = (s: string) => {
      switch (s) {
         case "pending": return "En attente"
         case "approved": return "Approuvée"
         case "rejected": return "Refusée"
         case "cancelled": return "Annulée"
         default: return s
      }
   }
   const statusColor = (s: string) => {
      switch (s) {
         case "pending": return "secondary" as const
         case "approved": return "default" as const
         case "rejected": return "destructive" as const
         case "cancelled": return "outline" as const
         default: return "secondary" as const
      }
   }

   return (
      <div className="flex flex-col gap-6 w-full">
         <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Administration</h2>
            <p className="text-muted-foreground">Gérez le catalogue, les utilisateurs et les réservations.</p>
         </div>

         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Matériel</CardTitle>
                  <HardHat className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <p className="text-2xl font-bold">{equipmentCount}</p>
                  <p className="text-xs text-muted-foreground">équipements au catalogue</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <p className="text-2xl font-bold">{reservationCount}</p>
                  <p className="text-xs text-muted-foreground">au total</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">En attente</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-xs text-muted-foreground">réservations à traiter</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <p className="text-2xl font-bold">{userCount}</p>
                  <p className="text-xs text-muted-foreground">inscrits</p>
               </CardContent>
            </Card>
         </div>

         <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Dernières réservations</h3>
            {recentReservations.length === 0 ? (
               <p className="text-sm text-muted-foreground">Aucune réservation pour le moment.</p>
            ) : (
               <div className="flex flex-col gap-3">
                  {recentReservations.map((r) => (
                     <Card key={r.id}>
                        <CardContent className="flex items-center justify-between gap-4 py-4">
                           <div className="flex flex-col gap-1">
                              <p className="text-sm font-medium">{r.equipment.name}</p>
                              <p className="text-xs text-muted-foreground">
                                 par {r.user.name ?? r.user.email} — du {fmt(r.startDate)} au {fmt(r.endDate)}
                              </p>
                           </div>
                           <Badge variant={statusColor(r.status)}>{statusLabel(r.status)}</Badge>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            )}
         </div>
      </div>
   )
}
