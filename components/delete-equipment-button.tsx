"use client"

import { Button } from "@/components/ui/button"
import { deleteEquipment } from "@/actions/equipment-actions"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

// Bouton de suppression d'un équipement (admin).
// `window.confirm` reste KISS (pas de composant AlertDialog dans le repo) ;
// useTransition garde l'UI réactive pendant la server action, puis
// router.refresh() recharge la liste (RSC).
export default function DeleteEquipmentButton({
   id,
   name,
}: {
   id: string
   name: string
}) {
   const router = useRouter()
   const [isPending, startTransition] = useTransition()

   function handleDelete() {
      if (!window.confirm(`Supprimer « ${name} » ? Cette action est irréversible.`)) {
         return
      }
      startTransition(async () => {
         const res = await deleteEquipment(id)
         if (res.status) {
            toast.success("Matériel supprimé")
            router.refresh()
         } else {
            toast.error(res.error ?? "Une erreur est survenue")
         }
      })
   }

   return (
      <Button
         variant="destructive"
         size="sm"
         onClick={handleDelete}
         disabled={isPending}
      >
         <Trash2 className="h-3.5 w-3.5 mr-1" />
         {isPending ? "Suppression…" : "Supprimer"}
      </Button>
   )
}
