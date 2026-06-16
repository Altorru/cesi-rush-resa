"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { equipmentFormSchema, type EquipmentFormValues } from "@/lib/equipment-schema"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

// Garde admin partagée : renvoie l'erreur standard si la session est absente
// ou si l'utilisateur n'est pas admin. Les server actions sont une frontière
// de confiance => on re-vérifie le rôle ici, jamais seulement dans le layout.
async function requireAdmin() {
   const session = await auth.api.getSession({ headers: await headers() })
   if (!session || session.user.role !== "admin") {
      return { ok: false as const, error: "Non autorisé" }
   }
   return { ok: true as const, session }
}

// Normalise les champs optionnels : chaîne vide -> null pour la base.
function normalize(values: EquipmentFormValues) {
   return {
      name: values.name,
      description: values.description?.trim() ? values.description.trim() : null,
      category: values.category,
      quantity: values.quantity,
      imageUrl: values.imageUrl?.trim() ? values.imageUrl.trim() : null,
   }
}

// Revalide les pages impactées par une mutation du catalogue.
function revalidateEquipment() {
   revalidatePath("/dashboard/admin/materiel")
   revalidatePath("/dashboard/admin")
   revalidatePath("/materiel")
}

// Crée un nouvel équipement (admin uniquement).
export async function createEquipment(input: EquipmentFormValues) {
   try {
      const guard = await requireAdmin()
      if (!guard.ok) return { status: false, error: guard.error }

      const parsed = equipmentFormSchema.safeParse(input)
      if (!parsed.success) {
         return { status: false, error: parsed.error.issues[0]?.message ?? "Données invalides" }
      }

      const created = await prisma.equipment.create({ data: normalize(parsed.data) })

      revalidateEquipment()
      return { status: true, id: created.id }
   } catch (error) {
      console.log(error)
      return { status: false, error: "Erreur lors de la création du matériel" }
   }
}

// Met à jour un équipement existant (admin uniquement).
export async function updateEquipment(id: string, input: EquipmentFormValues) {
   try {
      const guard = await requireAdmin()
      if (!guard.ok) return { status: false, error: guard.error }

      const parsed = equipmentFormSchema.safeParse(input)
      if (!parsed.success) {
         return { status: false, error: parsed.error.issues[0]?.message ?? "Données invalides" }
      }

      const existing = await prisma.equipment.findUnique({ where: { id } })
      if (!existing) {
         return { status: false, error: "Matériel introuvable" }
      }

      await prisma.equipment.update({ where: { id }, data: normalize(parsed.data) })

      revalidateEquipment()
      revalidatePath(`/materiel/${id}`)
      return { status: true, id }
   } catch (error) {
      console.log(error)
      return { status: false, error: "Erreur lors de la mise à jour du matériel" }
   }
}

// Supprime un équipement (admin uniquement).
// Sécurité : on refuse la suppression s'il reste des réservations actives
// (en attente ou approuvées) — la relation Prisma est en `onDelete: Cascade`,
// donc supprimer effacerait silencieusement ces réservations. Les réservations
// terminées/refusées/annulées (historique inerte) ne bloquent pas.
export async function deleteEquipment(id: string) {
   try {
      const guard = await requireAdmin()
      if (!guard.ok) return { status: false, error: guard.error }

      const existing = await prisma.equipment.findUnique({ where: { id } })
      if (!existing) {
         return { status: false, error: "Matériel introuvable" }
      }

      const activeCount = await prisma.reservation.count({
         where: { equipmentId: id, status: { in: ["pending", "approved"] } },
      })
      if (activeCount > 0) {
         return {
            status: false,
            error: `Suppression impossible : ${activeCount} réservation(s) active(s) sur ce matériel.`,
         }
      }

      await prisma.equipment.delete({ where: { id } })

      revalidateEquipment()
      return { status: true }
   } catch (error) {
      console.log(error)
      return { status: false, error: "Erreur lors de la suppression du matériel" }
   }
}
