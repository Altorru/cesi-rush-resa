import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import CancelReservationButton from "@/components/cancel-reservation-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Liste des réservations de l'utilisateur connecté (RSC).
export default async function ReservationsPage() {
   // Le layout (admin) garantit déjà la session ; garde défensive ici.
   const session = await auth.api.getSession({ headers: await headers() })
   const userId = session?.user.id

   const reservations = userId
      ? await prisma.reservation.findMany({
           where: { userId },
           include: { equipment: true },
           orderBy: { startDate: "asc" },
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
                     <CardHeader>
                        <CardTitle className="text-lg">{r.equipment.name}</CardTitle>
                     </CardHeader>
                     <CardContent className="flex items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                           Du {fmt(r.startDate)} au {fmt(r.endDate)}
                        </p>
                        <CancelReservationButton id={r.id} />
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}
      </div>
   )
}
