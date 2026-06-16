import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import CancelReservationButton from "@/components/cancel-reservation-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export default async function ReservationsPage() {
   const session = await auth.api.getSession({ headers: await headers() })
   const userId = session?.user.id

   const reservations = userId
      ? await prisma.reservation.findMany({
           where: { userId },
           include: { equipment: true },
           orderBy: { createdAt: "desc" },
        })
      : []

   const fmt = (d: Date) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(d)

   return (
      <div className="flex flex-col gap-6 w-full">
         <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Mes réservations</h2>
            <p className="text-muted-foreground">Gérez vos réservations de matériel.</p>
         </div>

         {reservations.length === 0 ? (
            <div className="flex flex-col items-start gap-4">
               <p className="text-muted-foreground">Vous n&apos;avez aucune réservation.</p>
               <Button asChild>
                  <Link href="/materiel">Parcourir le matériel</Link>
               </Button>
            </div>
         ) : (
            <div className="flex flex-col gap-4">
               {reservations.map((r) => (
                  <Card key={r.id}>
                     <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                           <CardTitle className="text-lg">{r.equipment.name}</CardTitle>
                           <Badge variant={statusColor(r.status)} className="shrink-0">
                              {statusLabel(r.status)}
                           </Badge>
                        </div>
                     </CardHeader>
                     <CardContent className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                           <p className="text-sm text-muted-foreground">
                              Du {fmt(r.startDate)} au {fmt(r.endDate)}
                           </p>
                           {(r.status === "pending" || r.status === "approved") && (
                              <CancelReservationButton id={r.id} />
                           )}
                        </div>
                        {r.adminMessage && (
                           <div className="rounded-md bg-muted px-3 py-2 text-sm">
                              <span className="font-medium text-foreground">Message :</span>{" "}
                              <span className="text-muted-foreground">{r.adminMessage}</span>
                           </div>
                        )}
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}
      </div>
   )
}
