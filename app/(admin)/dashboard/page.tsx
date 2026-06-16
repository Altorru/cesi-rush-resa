import ProfileCard from "@/components/profile-card"

export default function DashboardPage() {
   return (
      <div className="flex flex-col gap-4 sm:gap-6 w-full">
         <div className="flex flex-col gap-1 sm:gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
               Bon retour parmi nous !
            </h2>
         </div>

         <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_2fr]">
            <ProfileCard />
         </div>
      </div>
   )
}

