"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"

const OPTIONS = [
   { value: "name_asc", label: "Nom A→Z" },
   { value: "name_desc", label: "Nom Z→A" },
   { value: "category", label: "Par catégorie" },
] as const

// Dropdown de tri du catalogue. Met à jour le query param ?sort= ; la page
// RSC le relit et applique le orderBy correspondant.
export default function MaterielSort({ value }: { value: string }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   // Conserve les autres params (ex. ?cat=) au lieu d'écraser toute la query.
   const onSort = (v: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("sort", v)
      router.push(`${pathname}?${params.toString()}`)
   }

   return (
      <Select value={value} onValueChange={onSort}>
         <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier" />
         </SelectTrigger>
         <SelectContent>
            {OPTIONS.map((o) => (
               <SelectItem key={o.value} value={o.value}>
                  {o.label}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   )
}
