"use client"

import { Button } from "@/components/ui/button"
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { createEquipment, updateEquipment } from "@/actions/equipment-actions"
import { equipmentFormSchema, type EquipmentFormValues } from "@/lib/equipment-schema"
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/equipment-categories"
import type { Equipment } from "@prisma/client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

// Formulaire partagé création / édition d'un équipement (admin).
// Mode déterminé par la prop `equipment` : présente => édition, sinon création.
// Suit le pattern de reservation-form.tsx (react-hook-form + zodResolver + sonner).
export default function EquipmentForm({ equipment }: { equipment?: Equipment }) {
   const router = useRouter()
   const isEdit = Boolean(equipment)

   const form = useForm<EquipmentFormValues>({
      resolver: zodResolver(equipmentFormSchema),
      defaultValues: {
         name: equipment?.name ?? "",
         description: equipment?.description ?? "",
         category: equipment?.category ?? CATEGORY_ORDER[0],
         quantity: equipment?.quantity ?? 1,
         imageUrl: equipment?.imageUrl ?? "",
      },
   })

   async function onSubmit(values: EquipmentFormValues) {
      const res = isEdit
         ? await updateEquipment(equipment!.id, values)
         : await createEquipment(values)

      if (res.status) {
         toast.success(isEdit ? "Matériel mis à jour" : "Matériel créé")
         router.push("/dashboard/admin/materiel")
         router.refresh()
      } else {
         toast.error(res.error ?? "Une erreur est survenue")
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Nom</FormLabel>
                     <FormControl>
                        <Input placeholder="Perceuse à percussion" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="category"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Catégorie</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                           <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choisir une catégorie" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {CATEGORY_ORDER.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                 {CATEGORY_LABELS[cat]}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="quantity"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Quantité</FormLabel>
                     <FormControl>
                        <Input
                           type="number"
                           min={0}
                           max={9999}
                           step={1}
                           value={field.value}
                           onChange={(e) => field.onChange(e.target.valueAsNumber)}
                           onBlur={field.onBlur}
                           name={field.name}
                           ref={field.ref}
                        />
                     </FormControl>
                     <FormDescription>Nombre d&apos;unités disponibles à la réservation.</FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Description</FormLabel>
                     <FormControl>
                        <Textarea
                           placeholder="Caractéristiques, état, accessoires fournis…"
                           rows={4}
                           {...field}
                        />
                     </FormControl>
                     <FormDescription>Optionnel.</FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="imageUrl"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>URL de l&apos;image</FormLabel>
                     <FormControl>
                        <Input type="url" placeholder="https://…" {...field} />
                     </FormControl>
                     <FormDescription>Optionnel.</FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className="flex gap-3">
               <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                     ? "Enregistrement…"
                     : isEdit
                       ? "Enregistrer"
                       : "Créer le matériel"}
               </Button>
               <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/admin/materiel")}
               >
                  Annuler
               </Button>
            </div>
         </form>
      </Form>
   )
}
