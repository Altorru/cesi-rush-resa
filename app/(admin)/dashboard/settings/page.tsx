import TwoFactorSetup from "@/components/two-factor-setup"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
   return (
      <div className="flex flex-col gap-6 w-full max-w-2xl">
         <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-sm text-muted-foreground">
               Manage your account settings and security preferences.
            </p>
         </div>

         <Separator />

         <TwoFactorSetup />
      </div>
   )
}
