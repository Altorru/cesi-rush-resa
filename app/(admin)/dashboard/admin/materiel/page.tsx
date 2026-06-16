import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CATEGORY_LABELS } from "@/lib/equipment-categories"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import { Pencil, Plus } from "lucide-react"
import DeleteEquipmentButton from "@/components/delete-equipment-button"

// Catalogue admin : liste tout le matériel avec actions CRUD.
export default async function AdminMaterielPage() {
   const session = await auth.api.getSession({ headers: await headers() })
   if (!session || session.user.role !== "admin") {
      return redirect("/dashboard")
   }

   // Compte des réservations actives par équipement pour informer la suppression.
   const [equipment, activeByEquipment] = await Promise.all([
      prisma.equipment.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
      prisma.reservation.groupBy({
         by: ["equipmentId"],
         where: { status: { in: ["pending", "approved"] } },
         _count: true,
      }),
   ])
   const activeCount = new Map(activeByEquipment.map((r) => [r.equipmentId, r._count]))

   return (
      <div className="flex flex-col gap-6 w-full">
         <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
               <h2 className="text-3xl font-bold tracking-tight">Gestion du matériel</h2>
               <p className="text-muted-foreground">
                  Ajoutez, modifiez ou retirez des équipements du catalogue.
               </p>
            </div>
            <Button asChild>
               <Link href="/dashboard/admin/materiel/nouveau">
                  <Plus className="h-4 w-4 mr-1" />
                  Nouveau matériel
               </Link>
            </Button>
         </div>

         {equipment.length === 0 ? (
            <p className="text-muted-foreground">Aucun matériel au catalogue.</p>
         ) : (
            <div className="flex flex-col gap-3">
               {equipment.map((item) => {
                  const active = activeCount.get(item.id) ?? 0
                  return (
                     <Card key={item.id}>
                        <CardHeader className="pb-3">
                           <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-1">
                                 <CardTitle className="text-base sm:text-lg">{item.name}</CardTitle>
                                 <CardDescription>
                                    Quantité : {item.quantity}
                                    {active > 0 && ` — ${active} réservation(s) active(s)`}
                                 </CardDescription>
                              </div>
                              <Badge variant="secondary" className="shrink-0">
                                 {CATEGORY_LABELS[item.category]}
                              </Badge>
                           </div>
                        </CardHeader>
                        <CardContent className="flex items-center gap-2 flex-wrap">
                           <Button asChild variant="outline" size="sm">
                              <Link href={`/dashboard/admin/materiel/${item.id}`}>
                                 <Pencil className="h-3.5 w-3.5 mr-1" />
                                 Modifier
                              </Link>
                           </Button>
                           <DeleteEquipmentButton id={item.id} name={item.name} />
                        </CardContent>
                     </Card>
                  )
               })}
            </div>
         )}
      </div>
   )
}
