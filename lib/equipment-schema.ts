import { z } from "zod";
import { EquipmentCategory } from "@prisma/client";

// Schéma partagé client (react-hook-form) + serveur (server action) pour le
// CRUD admin du matériel. Sert à la création ET à l'édition (mêmes champs).
// `description` et `imageUrl` sont optionnels : on accepte la chaîne vide côté
// formulaire, et la server action la convertit en `null` avant insertion.
export const equipmentFormSchema = z.object({
   name: z
      .string()
      .trim()
      .min(1, { message: "Le nom est requis" })
      .max(120, { message: "Le nom est trop long (120 caractères max)" }),
   description: z
      .string()
      .trim()
      .max(1000, { message: "La description est trop longue (1000 caractères max)" })
      .optional()
      .or(z.literal("")),
   category: z.nativeEnum(EquipmentCategory, {
      message: "Catégorie invalide",
   }),
   // <input type="number"> renvoie un nombre via valueAsNumber ; on coerce par
   // sécurité (chaîne -> number) et on borne pour rester KISS.
   quantity: z.coerce
      .number({ message: "La quantité doit être un nombre" })
      .int({ message: "La quantité doit être un entier" })
      .min(0, { message: "La quantité ne peut pas être négative" })
      .max(9999, { message: "Quantité trop élevée" }),
   imageUrl: z
      .string()
      .trim()
      .url({ message: "URL d'image invalide" })
      .max(2048)
      .optional()
      .or(z.literal("")),
});

export type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;
