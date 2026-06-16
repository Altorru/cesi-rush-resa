"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

// Récupère les notifications non-supprimées d'un utilisateur.
// Les non-lues en premier, puis les 50 plus récentes.
export async function getNotifications() {
   try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) return { status: false, notifications: [], unreadCount: 0 }

      const notifications = await prisma.notification.findMany({
         where: { userId: session.user.id, deletedAt: null },
         orderBy: { createdAt: "desc" },
         take: 50,
      })

      const unreadCount = notifications.filter((n) => !n.seenAt).length

      return { status: true, notifications, unreadCount }
   } catch {
      return { status: false, notifications: [], unreadCount: 0 }
   }
}

// Marque une notification comme lue.
export async function markAsRead(id: string) {
   try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) return { status: false }

      await prisma.notification.updateMany({
         where: { id, userId: session.user.id },
         data: { seenAt: new Date() },
      })

      revalidatePath("/dashboard")
      return { status: true }
   } catch {
      return { status: false }
   }
}

// Marque toutes les notifications comme lues.
export async function markAllAsRead() {
   try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) return { status: false }

      await prisma.notification.updateMany({
         where: { userId: session.user.id, seenAt: null, deletedAt: null },
         data: { seenAt: new Date() },
      })

      revalidatePath("/dashboard")
      return { status: true }
   } catch {
      return { status: false }
   }
}

// Soft delete d'une notification (dismiss).
export async function dismissNotification(id: string) {
   try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) return { status: false }

      await prisma.notification.updateMany({
         where: { id, userId: session.user.id },
         data: { deletedAt: new Date() },
      })

      revalidatePath("/dashboard")
      return { status: true }
   } catch {
      return { status: false }
   }
}

// Crée une notification (utilisé en interne par les server actions).
export async function createNotification(
   userId: string,
   title: string,
   message?: string,
   link?: string,
) {
   try {
      await prisma.notification.create({
         data: { userId, title, message, link },
      })
      return { status: true }
   } catch {
      return { status: false }
   }
}
