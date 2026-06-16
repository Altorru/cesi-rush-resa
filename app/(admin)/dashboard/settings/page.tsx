import TwoFactorSetup from "@/components/two-factor-setup"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
   return (
      <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-2xl">
         <div className="flex flex-col gap-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Paramètres</h2>
            <p className="text-sm text-muted-foreground">
               Gérez les paramètres de votre compte et vos préférences de sécurité.
            </p>
         </div>

         <Separator />

         <TwoFactorSetup />
      </div>
   )
}
