import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Archive } from "lucide-react"
import AdminReservationActions from "@/components/admin-reservation-actions"
import { completeReservation } from "@/actions/reservation-actions"

const statusLabel = (s: string) => {
   switch (s) {
      case "pending": return "En attente"
      case "approved": return "Approuvée"
      case "rejected": return "Refusée"
      case "completed": return "Terminée"
      case "cancelled": return "Annulée"
      default: return s
   }
}

const statusColor = (s: string) => {
   switch (s) {
      case "pending": return "secondary" as const
      case "approved": return "default" as const
      case "rejected": return "destructive" as const
      case "completed": return "outline" as const
      case "cancelled": return "outline" as const
      default: return "secondary" as const
   }
}

const fmt = (d: Date) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(d)

export default async function AdminReservationsPage() {
   const session = await auth.api.getSession({ headers: await headers() })
   if (!session || session.user.role !== "admin") {
      return redirect("/dashboard")
   }

   const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
         equipment: true,
         user: { select: { id: true, name: true, email: true } },
      },
   })

   const pendingReservations = reservations.filter((r) => r.status === "pending")
   const recentReservations = reservations.filter(
      (r) => r.status !== "pending" && r.status !== "cancelled",
   )

   const TabBadge = ({ count }: { count: number }) =>
      count > 0 ? (
         <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
            {count}
         </span>
      ) : null

   return (
      <div className="flex flex-col gap-6 w-full">
         <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Réservations</h2>
            <p className="text-muted-foreground">
               Gérez les demandes de réservation du matériel.
            </p>
         </div>

         {reservations.length === 0 ? (
            <div className="flex flex-col items-start gap-4">
               <p className="text-muted-foreground">Aucune réservation pour le moment.</p>
               <Button asChild variant="outline">
                  <Link href="/dashboard/admin">← Retour au tableau de bord</Link>
               </Button>
            </div>
         ) : (
            <Tabs defaultValue="pending" className="w-full">
               <TabsList>
                  <TabsTrigger value="pending" className="relative">
                     En attente
                     <TabBadge count={pendingReservations.length} />
                  </TabsTrigger>
                  <TabsTrigger value="processed">Traitées</TabsTrigger>
                  <TabsTrigger value="all">Toutes</TabsTrigger>
               </TabsList>

               <TabsContent value="pending" className="mt-4 space-y-3">
                  {pendingReservations.length === 0 ? (
                     <p className="text-sm text-muted-foreground py-4">
                        Aucune réservation en attente.
                     </p>
                  ) : (
                     pendingReservations.map((r) => (
                        <ReservationCard
                           key={r.id}
                           reservation={r}
                           showActions
                        />
                     ))
                  )}
               </TabsContent>

               <TabsContent value="processed" className="mt-4 space-y-3">
                  {recentReservations.length === 0 ? (
                     <p className="text-sm text-muted-foreground py-4">
                        Aucune réservation traitée.
                     </p>
                  ) : (
                     recentReservations.map((r) => (
                        <ReservationCard
                           key={r.id}
                           reservation={r}
                           showComplete={r.status === "approved"}
                        />
                     ))
                  )}
               </TabsContent>

               <TabsContent value="all" className="mt-4 space-y-3">
                  {reservations.map((r) => (
                     <ReservationCard
                        key={r.id}
                        reservation={r}
                        showActions={r.status === "pending"}
                        showComplete={r.status === "approved"}
                     />
                  ))}
               </TabsContent>
            </Tabs>
         )}
      </div>
   )
}

function ReservationCard({
   reservation: r,
   showActions = false,
   showComplete = false,
}: {
   reservation: {
      id: string
      status: string
      startDate: Date
      endDate: Date
      createdAt: Date
      adminMessage: string | null
      adminReviewedAt: Date | null
      equipment: { name: string }
      user: { name: string | null; email: string }
   }
   showActions?: boolean
   showComplete?: boolean
}) {
   return (
      <Card className={r.status === "pending" ? "ring-1 ring-primary/20" : ""}>
         <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
               <div className="flex flex-col gap-1">
                  <CardTitle className="text-base sm:text-lg">{r.equipment.name}</CardTitle>
                  <CardDescription>
                    par {r.user.name ?? r.user.email} — du {fmt(r.startDate)} au{" "}
                    {fmt(r.endDate)}
                  </CardDescription>
               </div>
               <Badge variant={statusColor(r.status)} className="shrink-0">
                  {statusLabel(r.status)}
               </Badge>
            </div>
         </CardHeader>
         <CardContent className="flex flex-col gap-3">
            {r.adminMessage && (
               <div className="rounded-md bg-muted px-3 py-2 text-sm">
                  <span className="font-medium text-foreground">Message :</span>{" "}
                  <span className="text-muted-foreground">{r.adminMessage}</span>
               </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
               {showActions && (
                  <AdminReservationActions id={r.id} />
               )}
               {showComplete && (
                  <form action={completeReservation.bind(null, r.id) as unknown as () => Promise<void>}>
                     <Button type="submit" variant="outline" size="sm">
                        <Archive className="h-3.5 w-3.5 mr-1" />
                        Marquer terminée
                     </Button>
                  </form>
               )}
            </div>
         </CardContent>
      </Card>
   )
}
