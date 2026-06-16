import Link from "next/link"
import { Wrench } from "lucide-react"
import type { Prisma, EquipmentCategory } from "@prisma/client"
import prisma from "@/lib/prisma"
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/equipment-categories"
import { cn } from "@/lib/utils"
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
   searchParams: Promise<{ sort?: string; cat?: string }>
}) {
   const { sort, cat } = await searchParams
   const sortKey: SortKey = sort === "name_desc" || sort === "category" ? sort : "name_asc"
   // `cat` n'est valide que s'il correspond à une vraie catégorie de l'enum.
   const activeCat = CATEGORY_ORDER.find((c) => c === cat)
   const equipment = await prisma.equipment.findMany({
      where: activeCat ? { category: activeCat } : undefined,
      orderBy: orderByFor(sortKey),
   })

   // Construit un href en conservant le tri courant (et inversement le filtre).
   const hrefFor = (next: EquipmentCategory | null) => {
      const params = new URLSearchParams()
      if (next) params.set("cat", next)
      if (sortKey !== "name_asc") params.set("sort", sortKey)
      const qs = params.toString()
      return qs ? `/materiel?${qs}` : "/materiel"
   }

   return (
      <div className="container mx-auto py-12 flex flex-col gap-6">
         <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Matériel BTP</h1>
            <p className="text-muted-foreground">Parcourez le catalogue et réservez du matériel.</p>
         </div>

         <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Filtres par catégorie — Links RSC, conservent le tri courant. */}
            <div className="flex flex-wrap gap-2">
               <Link
                  href={hrefFor(null)}
                  className={cn(
                     "rounded-full border px-3 py-1 text-sm transition-colors",
                     !activeCat
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary hover:text-foreground",
                  )}
               >
                  Tous
               </Link>
               {CATEGORY_ORDER.map((c) => (
                  <Link
                     key={c}
                     href={hrefFor(c)}
                     className={cn(
                        "rounded-full border px-3 py-1 text-sm transition-colors",
                        activeCat === c
                           ? "border-primary bg-primary text-primary-foreground"
                           : "border-border text-muted-foreground hover:border-primary hover:text-foreground",
                     )}
                  >
                     {CATEGORY_LABELS[c]}
                  </Link>
               ))}
            </div>
            <div className="shrink-0">
               <MaterielSort value={sortKey} />
            </div>
         </div>

         {equipment.length === 0 ? (
            <p className="text-muted-foreground">
               {activeCat
                  ? `Aucun matériel dans la catégorie « ${CATEGORY_LABELS[activeCat]} » pour le moment.`
                  : "Aucun matériel disponible pour le moment."}
            </p>
         ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {equipment.map((item) => (
                  <Card key={item.id} className="group flex flex-col overflow-hidden pt-0">
                     <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                        {item.imageUrl ? (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                           />
                        ) : (
                           <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                              <Wrench className="size-10" />
                           </div>
                        )}
                     </div>
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
