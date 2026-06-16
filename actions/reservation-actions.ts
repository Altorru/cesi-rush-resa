"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { reservationFormSchema, type ReservationFormValues } from "@/lib/reservation-schema"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

// Crée une réservation pour l'utilisateur connecté.
// KISS : pas de contrôle de disponibilité/chevauchement (choix produit).
export async function createReservation(input: ReservationFormValues) {
   try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) {
         return { status: false, error: "Non authentifié" }
      }

      const parsed = reservationFormSchema.safeParse(input)
      if (!parsed.success) {
         return { status: false, error: parsed.error.issues[0]?.message ?? "Données invalides" }
      }

      const { equipmentId, startDate, endDate } = parsed.data
      await prisma.reservation.create({
         data: {
            userId: session.user.id,
            equipmentId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
         },
      })

      revalidatePath("/dashboard/reservations")
      return { status: true }
   } catch (error) {
      console.log(error)
      return { status: false, error: "Erreur lors de la création de la réservation" }
   }
}

// Annule une réservation. Vérifie l'ownership : on ne peut supprimer
// que ses propres résas. Message identique si introuvable ou non-propriétaire
// pour ne pas révéler l'existence d'une résa d'autrui.
export async function cancelReservation(id: string) {
   try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) {
         return { status: false, error: "Non authentifié" }
      }

      const reservation = await prisma.reservation.findUnique({ where: { id } })
      if (!reservation || reservation.userId !== session.user.id) {
         return { status: false, error: "Réservation introuvable" }
      }

      await prisma.reservation.delete({ where: { id } })
      revalidatePath("/dashboard/reservations")
      return { status: true }
   } catch (error) {
      console.log(error)
      return { status: false, error: "Erreur lors de l'annulation" }
   }
}
