"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
   approveReservation,
   rejectReservation,
} from "@/actions/reservation-actions"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import { CheckCircle, XCircle } from "lucide-react"

// Boutons d'approbation/refus avec message optionnel pour l'admin.
export default function AdminReservationActions({ id }: { id: string }) {
   const router = useRouter()
   const [isPending, startTransition] = useTransition()
   const [message, setMessage] = useState("")
   const [showMessageInput, setShowMessageInput] = useState<"approve" | "reject" | null>(null)

   const handleAction = async (action: "approve" | "reject") => {
      startTransition(async () => {
         const res =
            action === "approve"
               ? await approveReservation(id, message || undefined)
               : await rejectReservation(id, message || undefined)

         if (res.status) {
            toast.success(
               action === "approve"
                  ? "Réservation approuvée"
                  : "Réservation refusée",
            )
            setMessage("")
            setShowMessageInput(null)
            router.refresh()
         } else {
            toast.error(res.error ?? "Une erreur est survenue")
         }
      })
   }

   return (
      <div className="flex flex-col gap-2 w-full">
         {showMessageInput && (
            <div className="flex flex-col gap-2">
               <Textarea
                  placeholder="Message optionnel à l'utilisateur..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[60px] text-sm"
                  rows={2}
               />
               <div className="flex gap-2">
                  <Button
                     size="sm"
                     onClick={() => handleAction(showMessageInput)}
                     disabled={isPending}
                  >
                     {isPending
                        ? "En cours..."
                        : showMessageInput === "approve"
                          ? "Confirmer l'approbation"
                          : "Confirmer le refus"}
                  </Button>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        setShowMessageInput(null)
                        setMessage("")
                     }}
                     disabled={isPending}
                  >
                     Annuler
                  </Button>
               </div>
            </div>
         )}

         {!showMessageInput && (
            <div className="flex items-center gap-2">
               <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowMessageInput("approve")}
                  disabled={isPending}
               >
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Approuver
               </Button>
               <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowMessageInput("reject")}
                  disabled={isPending}
               >
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Refuser
               </Button>
            </div>
         )}
      </div>
   )
}
