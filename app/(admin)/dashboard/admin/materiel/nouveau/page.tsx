import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import EquipmentForm from "@/components/equipment-form"

// Création d'un nouvel équipement (admin).
export default async function NewMaterielPage() {
   const session = await auth.api.getSession({ headers: await headers() })
   if (!session || session.user.role !== "admin") {
      return redirect("/dashboard")
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
            <h2 className="text-3xl font-bold tracking-tight">Nouveau matériel</h2>
            <p className="text-muted-foreground">Ajoutez un équipement au catalogue.</p>
         </div>

         <EquipmentForm />
      </div>
   )
}
