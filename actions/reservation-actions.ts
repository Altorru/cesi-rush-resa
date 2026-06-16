"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { reservationFormSchema, type ReservationFormValues } from "@/lib/reservation-schema"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notification-actions"

// Crée une réservation pour l'utilisateur connecté.
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

      const equipment = await prisma.equipment.findUnique({ where: { id: equipmentId } })
      if (!equipment) {
         return { status: false, error: "Matériel introuvable" }
      }

      await prisma.reservation.create({
         data: {
            userId: session.user.id,
            equipmentId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
         },
      })

      // Notifier les admins
      const admins = await prisma.user.findMany({
         where: { role: "admin" },
         select: { id: true },
      })
      for (const admin of admins) {
         await createNotification(
            admin.id,
            "Nouvelle réservation",
            `${session.user.name ?? session.user.email} a réservé ${equipment.name} du ${new Date(startDate).toLocaleDateString("fr-FR")} au ${new Date(endDate).toLocaleDateString("fr-FR")}.`,
            "/dashboard/admin/reservations",
         )
      }

      revalidatePath("/dashboard/reservations")
      revalidatePath("/dashboard/admin")
      return { status: true }
   } catch (error) {
      console.log(error)
      return { status: false, error: "Erreur lors de la création de la réservation" }
   }
}

// Approuve une réservation (admin uniquement).
export async function approveReservation(id: string, message?: string) {
   try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session || session.user.role !== "admin") {
         return { status: false, error: "Non autorisé" }
      }

      const reservation = await prisma.reservation.findUnique({
         where: { id },
         include: { equipment: true, user: { select: { id: true, name: true, email: true } } },
      })
      if (!reservation) {
         return { status: false, error: "Réservation introuvable" }
      }

      await prisma.reservation.update({
         where: { id },
         data: { status: "approved", adminMessage: message ?? null, adminReviewedAt: new Date() },
      })

      await createNotification(
         reservation.user.id,
         "Réservation approuvée",
         `Votre réservation pour ${reservation.equipment.name} a été approuvée.${message ? ` Message : ${message}` : ""}`,
         "/dashboard/reservations",
      )

      revalidatePath("/dashboard/admin")
      revalidatePath("/dashboard/admin/reservations")
      revalidatePath("/dashboard/reservations")
      return { status: true }
   } catch (error) {
      console.log(error)
      return { status: false, error: "Erreur lors de l'approbation" }
   }
}

// Refuse une réservation (admin uniquement).
export async function rejectReservation(id: string, message?: string) {
   try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session || session.user.role !== "admin") {
         return { status: false, error: "Non autorisé" }
      }

      const reservation = await prisma.reservation.findUnique({
         where: { id },
         include: { equipment: true, user: { select: { id: true, name: true, email: true } } },
      })
      if (!reservation) {
         return { status: false, error: "Réservation introuvable" }
      }

      await prisma.reservation.update({
         where: { id },
         data: { status: "rejected", adminMessage: message ?? null, adminReviewedAt: new Date() },
      })

      await createNotification(
         reservation.user.id,
         "Réservation refusée",
         `Votre réservation pour ${reservation.equipment.name} a été refusée.${message ? ` Motif : ${message}` : ""}`,
         "/dashboard/reservations",
      )

      revalidatePath("/dashboard/admin")
      revalidatePath("/dashboard/admin/reservations")
      revalidatePath("/dashboard/reservations")
      return { status: true }
   } catch (error) {
      console.log(error)
      return { status: false, error: "Erreur lors du refus" }
   }
}

// Marque une réservation comme terminée.
export async function completeReservation(id: string) {
   try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session || session.user.role !== "admin") {
         return { status: false, error: "Non autorisé" }
      }

      const reservation = await prisma.reservation.findUnique({
         where: { id },
         include: { equipment: true, user: { select: { id: true } } },
      })
      if (!reservation) {
         return { status: false, error: "Réservation introuvable" }
      }

      await prisma.reservation.update({
         where: { id },
         data: { status: "completed" },
      })

      await createNotification(
         reservation.user.id,
         "Réservation terminée",
         `La réservation pour ${reservation.equipment.name} est maintenant terminée. Merci !`,
         "/dashboard/reservations",
      )

      revalidatePath("/dashboard/admin")
      revalidatePath("/dashboard/admin/reservations")
      revalidatePath("/dashboard/reservations")
      return { status: true }
   } catch (error) {
      console.log(error)
      return { status: false, error: "Erreur" }
   }
}

// Annule une réservation (par le user propriétaire).
export async function cancelReservation(id: string) {
   try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) {
         return { status: false, error: "Non authentifié" }
      }

      const reservation = await prisma.reservation.findUnique({
         where: { id },
         include: { equipment: true },
      })
      if (!reservation || reservation.userId !== session.user.id) {
         return { status: false, error: "Réservation introuvable" }
      }
      // Ne peut annuler que les réservations en attente ou approuvées
      if (reservation.status === "completed" || reservation.status === "rejected" || reservation.status === "cancelled") {
         return { status: false, error: "Impossible d'annuler cette réservation" }
      }

      await prisma.reservation.update({
         where: { id },
         data: { status: "cancelled", adminReviewedAt: new Date() },
      })

      // Notifier les admins
      const admins = await prisma.user.findMany({
         where: { role: "admin" },
         select: { id: true },
      })
      for (const admin of admins) {
         await createNotification(
            admin.id,
            "Réservation annulée",
            `${session.user.name ?? session.user.email} a annulé sa réservation pour ${reservation.equipment.name}.`,
         )
      }

      revalidatePath("/dashboard/reservations")
      revalidatePath("/dashboard/admin")
      return { status: true }
   } catch (error) {
      console.log(error)
      return { status: false, error: "Erreur lors de l'annulation" }
   }
}
