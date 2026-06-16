import Link from 'next/link'
import { Drill, Scissors, Layers, Paintbrush, Zap, Truck, Ruler, Shovel, Trash2, type LucideIcon } from 'lucide-react'
import type { EquipmentCategory } from '@prisma/client'
import prisma from '@/lib/prisma'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/equipment-categories'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card } from './ui/card'
import FadeInView from './animate-ui/fade-in-view';

// Icônes par catégorie (colocées ici : du JSX/lucide, donc hors du module
// partagé server-safe lib/equipment-categories.ts).
const CATEGORY_ICONS: Record<EquipmentCategory, LucideIcon> = {
   PERCAGE_FIXATION: Drill,
   DECOUPE: Scissors,
   MACONNERIE: Layers,
   PEINTURE_FINITION: Paintbrush,
   ELECTRIQUE_ENERGIE: Zap,
   LEVAGE_MANUTENTION: Truck,
   MESURE_CONTROLE: Ruler,
   EXTERIEUR_TERRASSEMENT: Shovel,
   NETTOYAGE: Trash2,
}

// Section "Catégorie d'outils" de la home — désormais alimentée par la DB
// (regroupe le vrai matériel réservable par catégorie) au lieu d'un tableau
// hardcodé. Classes responsive reprises du redesign de main.
export default async function TechStackSection() {
   const equipment = await prisma.equipment.findMany({ orderBy: { name: "asc" } })

   const byCategory = new Map<EquipmentCategory, string[]>()
   for (const e of equipment) {
      const list = byCategory.get(e.category) ?? []
      list.push(e.name)
      byCategory.set(e.category, list)
   }
   // Ordre d'origine, catégories non vides uniquement.
   const categories = CATEGORY_ORDER.filter((c) => byCategory.has(c))

   return (
      <section className="pb-12 sm:pb-20 md:pb-32 pt-12 sm:pt-20 md:pt-32 container mx-auto">
         <FadeInView className="text-center space-y-3 sm:space-y-4 pb-10 sm:pb-16 mx-auto max-w-4xl">
            <Badge className='px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium'>Outils</Badge>
            <h2 className="mx-auto mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl tracking-tight">
               Catégorie d&apos;outils
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground pt-1">
               Découvrez notre large gamme d&apos;outils de chantier
            </p>
         </FadeInView>

         {categories.length === 0 ? (
            <p className="text-center text-muted-foreground">
               Aucun matériel disponible pour le moment.
            </p>
         ) : (
            <Card className="grid divide-x divide-y overflow-hidden rounded-2xl sm:rounded-3xl border border-card sm:grid-cols-2 lg:grid-cols-3 lg:divide-y-0">
               {categories.map((category, index) => {
                  const Icon = CATEGORY_ICONS[category]
                  const items = byCategory.get(category) ?? []
                  return (
                     <FadeInView
                        key={category}
                        delay={0.1 * (index + 2)}
                        className="group relative transition-shadow duration-300 hover:z-[1] hover:shadow-2xl hover:shadow-primary"
                     >
                        <div className="relative space-y-6 sm:space-y-8 py-8 sm:py-12 px-5 sm:p-8">
                           <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-primary/10">
                              <Icon className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
                           </div>
                           <div className="space-y-2">
                              <h5 className="text-lg sm:text-xl text-muted-foreground font-semibold transition group-hover:text-primary">
                                 {CATEGORY_LABELS[category]}
                              </h5>
                              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                                 {items.map((name) => (
                                    <li key={name}>{name}</li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                     </FadeInView>
                  )
               })}
            </Card>
         )}

         <div className="flex justify-center pt-10 sm:pt-12">
            <Button asChild size="lg">
               <Link href="/materiel">Voir le matériel</Link>
            </Button>
         </div>
      </section>
   )
}
