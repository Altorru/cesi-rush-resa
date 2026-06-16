import { z } from "zod";

// Schéma partagé client (react-hook-form) + serveur (server action).
// Les dates viennent d'un <input type="date"> => chaînes "YYYY-MM-DD".
// KISS : on valide juste la cohérence des dates, PAS la disponibilité.
export const reservationFormSchema = z
   .object({
      equipmentId: z.string().min(1, { message: "Matériel requis" }),
      startDate: z.string().min(1, { message: "Date de début requise" }),
      endDate: z.string().min(1, { message: "Date de fin requise" }),
   })
   .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
      message: "La date de fin doit être après la date de début",
      path: ["endDate"],
   });

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
