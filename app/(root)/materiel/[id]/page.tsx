import Link from "next/link"
import { Wrench } from "lucide-react"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { CATEGORY_LABELS } from "@/lib/equipment-categories"
import ReservationForm from "@/components/reservation-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"

// Détail public d'un matériel. La réservation reste réservée aux connectés :
// si pas de session, on affiche un encart de connexion au lieu du formulaire.
// (actions/reservation-actions.ts garde aussi son garde-fou côté serveur.)
export default async function MaterielDetailPage({
   params,
}: {
   params: Promise<{ id: string }>
}) {
   const { id } = await params
   const item = await prisma.equipment.findUnique({ where: { id } })
   if (!item) notFound()

   const session = await auth.api.getSession({ headers: await headers() })

   return (
      <div className="container mx-auto py-12 flex flex-col gap-6 max-w-2xl">
         <Button asChild variant="ghost" size="sm" className="w-fit">
            <Link href="/materiel">← Retour au catalogue</Link>
         </Button>

         <Card className="overflow-hidden pt-0">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
               {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                     src={item.imageUrl}
                     alt={item.name}
                     className="h-full w-full object-cover"
                  />
               ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                     <Wrench className="size-14" />
                  </div>
               )}
            </div>
            <CardHeader>
               <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-2xl">{item.name}</CardTitle>
                  <Badge variant="secondary">{CATEGORY_LABELS[item.category]}</Badge>
               </div>
               {item.description && <CardDescription>{item.description}</CardDescription>}
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
               <p className="text-sm text-muted-foreground">
                  Quantité disponible : {item.quantity}
               </p>
               {session ? (
                  <ReservationForm equipmentId={item.id} />
               ) : (
                  <div className="flex flex-col items-start gap-3 rounded-md border border-dashed p-4">
                     <p className="text-sm text-muted-foreground">
                        Connectez-vous pour réserver ce matériel.
                     </p>
                     <Button asChild>
                        <Link href="/sign-in">Se connecter</Link>
                     </Button>
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
   )
}
