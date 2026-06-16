import Link from "next/link"
import type { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"
import { CATEGORY_LABELS } from "@/lib/equipment-categories"
import MaterielSort from "@/components/materiel-sort"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"

type SortKey = "name_asc" | "name_desc" | "category"

function orderByFor(
   sort: SortKey,
): Prisma.EquipmentOrderByWithRelationInput | Prisma.EquipmentOrderByWithRelationInput[] {
   switch (sort) {
      case "name_desc":
         return { name: "desc" }
      case "category":
         return [{ category: "asc" }, { name: "asc" }]
      default:
         return { name: "asc" }
   }
}

// Catalogue public du matériel BTP (RSC, sous (root) → accessible sans session).
// Next 15 : searchParams est asynchrone.
export default async function MaterielPage({
   searchParams,
}: {
   searchParams: Promise<{ sort?: string }>
}) {
   const { sort } = await searchParams
   const sortKey: SortKey = sort === "name_desc" || sort === "category" ? sort : "name_asc"
   const equipment = await prisma.equipment.findMany({ orderBy: orderByFor(sortKey) })

   return (
      <div className="container mx-auto py-12 flex flex-col gap-6">
         <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Matériel BTP</h1>
            <p className="text-muted-foreground">Parcourez le catalogue et réservez du matériel.</p>
         </div>

         <div className="flex justify-end">
            <MaterielSort value={sortKey} />
         </div>

         {equipment.length === 0 ? (
            <p className="text-muted-foreground">Aucun matériel disponible pour le moment.</p>
         ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {equipment.map((item) => (
                  <Card key={item.id} className="flex flex-col">
                     <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                           <CardTitle>{item.name}</CardTitle>
                           <Badge variant="secondary">{CATEGORY_LABELS[item.category]}</Badge>
                        </div>
                        {item.description && <CardDescription>{item.description}</CardDescription>}
                     </CardHeader>
                     <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground">
                           Quantité disponible : {item.quantity}
                        </p>
                     </CardContent>
                     <CardFooter>
                        <Button asChild className="w-full">
                           <Link href={`/materiel/${item.id}`}>Réserver</Link>
                        </Button>
                     </CardFooter>
                  </Card>
               ))}
            </div>
         )}
      </div>
   )
}
