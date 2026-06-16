"use client"

import { Button } from "@/components/ui/button"
import { cancelReservation } from "@/actions/reservation-actions"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

// Bouton d'annulation. useTransition pour garder l'UI réactive pendant
// l'appel à la server action ; router.refresh() recharge la liste (RSC).
export default function CancelReservationButton({ id }: { id: string }) {
   const router = useRouter()
   const [isPending, startTransition] = useTransition()

   function handleCancel() {
      startTransition(async () => {
         const res = await cancelReservation(id)
         if (res.status) {
            toast.success("Réservation annulée")
            router.refresh()
         } else {
            toast.error(res.error ?? "Une erreur est survenue")
         }
      })
   }

   return (
      <Button variant="destructive" size="sm" onClick={handleCancel} disabled={isPending}>
         {isPending ? "Annulation..." : "Annuler"}
      </Button>
   )
}
