"use client"

import { Button } from "@/components/ui/button"
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createReservation } from "@/actions/reservation-actions"
import { reservationFormSchema, type ReservationFormValues } from "@/lib/reservation-schema"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

// Formulaire de réservation. Suit le pattern de sign-in-form.tsx.
// Dates via <input type="date"> pour rester KISS (pas de calendar/popover).
export default function ReservationForm({ equipmentId }: { equipmentId: string }) {
   const router = useRouter()
   const form = useForm<ReservationFormValues>({
      resolver: zodResolver(reservationFormSchema),
      defaultValues: {
         equipmentId,
         startDate: "",
         endDate: "",
      },
   })

   async function onSubmit(values: ReservationFormValues) {
      toast.loading("Réservation en cours...")
      const res = await createReservation(values)
      toast.dismiss()
      if (res.status) {
         toast.success("Réservation enregistrée")
         router.push("/dashboard/reservations")
      } else {
         toast.error(res.error ?? "Une erreur est survenue")
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
               control={form.control}
               name="startDate"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Date de début</FormLabel>
                     <FormControl>
                        <Input type="date" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="endDate"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Date de fin</FormLabel>
                     <FormControl>
                        <Input type="date" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
               Réserver
            </Button>
         </form>
      </Form>
   )
}
