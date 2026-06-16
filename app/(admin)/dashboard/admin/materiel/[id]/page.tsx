import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import EquipmentForm from "@/components/equipment-form"

// Édition d'un équipement existant (admin). Next 15 : params est asynchrone.
export default async function EditMaterielPage({
   params,
}: {
   params: Promise<{ id: string }>
}) {
   const session = await auth.api.getSession({ headers: await headers() })
   if (!session || session.user.role !== "admin") {
      return redirect("/dashboard")
   }

   const { id } = await params
   const equipment = await prisma.equipment.findUnique({ where: { id } })
   if (!equipment) {
      notFound()
   }

   return (
      <div className="flex flex-col gap-6 w-full">
         <div className="flex flex-col gap-3">
            <Button asChild variant="ghost" size="sm" className="self-start">
               <Link href="/dashboard/admin/materiel">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Retour
               </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Modifier le matériel</h2>
            <p className="text-muted-foreground">{equipment.name}</p>
         </div>

         <EquipmentForm equipment={equipment} />
      </div>
   )
}
