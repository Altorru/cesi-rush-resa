"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { useUser, useSetUser } from "@/context/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import {
   InputOTP,
   InputOTPGroup,
   InputOTPSlot,
} from "@/components/ui/input-otp"
import { Badge } from "@/components/ui/badge"
import {
   Shield,
   ShieldOff,
   Copy,
   Check,
   Smartphone,
   AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import QRCode from "qrcode"

type SetupStep = "idle" | "password" | "qr" | "verify" | "done"

export default function TwoFactorSetup() {
   const setUser = useSetUser()
   const currentUser = useUser()
   const [isEnabled, setIsEnabled] = useState(currentUser?.twoFactorEnabled ?? false)
   const [step, setStep] = useState<SetupStep>("idle")
   const [isLoading, setIsLoading] = useState(false)
   const [password, setPassword] = useState("")
   const [totpCode, setTotpCode] = useState("")
   const [qrDataUrl, setQrDataUrl] = useState("")
   const [totpUri, setTotpUri] = useState("")
   const [backupCodes, setBackupCodes] = useState<string[]>([])
   const [copiedCodes, setCopiedCodes] = useState(false)

   // Generate QR code data URL from TOTP URI
   useEffect(() => {
      if (totpUri) {
         QRCode.toDataURL(totpUri, {
            width: 256,
            margin: 2,
            color: {
               dark: "#000000",
               light: "#ffffff",
            },
         })
            .then(setQrDataUrl)
            .catch(() => {
               // Fallback: try with default colors
               QRCode.toDataURL(totpUri, { width: 256 }).then(setQrDataUrl)
            })
      }
   }, [totpUri])

   // ── Start enabling 2FA ──────────────────────────────
   async function handleStartEnable() {
      setIsLoading(true)
      const toastId = toast.loading("Préparation de la configuration 2FA...")

      try {
         const { data, error } = await authClient.twoFactor.enable({
            password,
         })

         toast.dismiss(toastId)

         if (error) {
            toast.error(error.message || "Mot de passe incorrect")
            setIsLoading(false)
            return
         }

         if (data) {
            setTotpUri(data.totpURI)
            setBackupCodes(data.backupCodes || [])
            setStep("qr")
         }
      } catch {
         toast.dismiss(toastId)
         toast.error("Une erreur est survenue")
      }

      setIsLoading(false)
   }

   // ── Verify TOTP code to complete setup ──────────────
   async function handleVerify() {
      if (totpCode.length !== 6) {
         toast.error("Veuillez saisir un code valide à 6 chiffres")
         return
      }

      setIsLoading(true)
      const toastId = toast.loading("Vérification du code...")

      try {
         const { error } = await authClient.twoFactor.verifyTotp({
            code: totpCode,
         })

         toast.dismiss(toastId)

         if (error) {
            toast.error(error.message || "Code invalide. Veuillez réessayer.")
            setIsLoading(false)
            return
         }

         setIsEnabled(true)
         setStep("done")
         setUser((prev) =>
            prev ? { ...prev, twoFactorEnabled: true } : prev
         )
         toast.success("2FA activée avec succès !")
      } catch {
         toast.dismiss(toastId)
         toast.error("Une erreur est survenue")
      }

      setIsLoading(false)
   }

   // ── Disable 2FA ─────────────────────────────────────
   async function handleDisable() {
      if (!password) {
         toast.error("Veuillez saisir votre mot de passe")
         return
      }

      setIsLoading(true)
      const toastId = toast.loading("Désactivation de la 2FA...")

      try {
         const { error } = await authClient.twoFactor.disable({
            password,
         })

         toast.dismiss(toastId)

         if (error) {
            toast.error(error.message || "Mot de passe incorrect")
            setIsLoading(false)
            return
         }

         setIsEnabled(false)
         setStep("idle")
         setPassword("")
         setTotpCode("")
         setTotpUri("")
         setQrDataUrl("")
         setBackupCodes([])
         setUser((prev) =>
            prev ? { ...prev, twoFactorEnabled: false } : prev
         )
         toast.success("2FA désactivée avec succès")
      } catch {
         toast.dismiss(toastId)
         toast.error("Une erreur est survenue")
      }

      setIsLoading(false)
   }

   // ── Copy backup codes ───────────────────────────────
   function copyBackupCodes() {
      navigator.clipboard.writeText(backupCodes.join("\n"))
      setCopiedCodes(true)
      toast.success("Codes de secours copiés dans le presse-papier")
      setTimeout(() => setCopiedCodes(false), 2000)
   }

   // ── Annuler / Reset ──────────────────────────────────
   function handleCancel() {
      setStep("idle")
      setPassword("")
      setTotpCode("")
      setTotpUri("")
      setQrDataUrl("")
      setBackupCodes([])
   }

   // ── Show 2FA is enabled (no setup needed) ───────────
   if (isEnabled && step !== "done") {
      return (
         <Card>
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                        <Shield className="h-5 w-5 text-green-500" />
                     </div>
                     <div>
                        <CardTitle className="text-lg">Authentification à deux facteurs</CardTitle>
                        <CardDescription>Votre compte est protégé par la 2FA</CardDescription>
                     </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                     <Check className="mr-1 h-3 w-3" />
                     Activée
                  </Badge>
               </div>
            </CardHeader>
            <CardContent>
               <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                     <AlertCircle className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                     <p className="text-sm text-muted-foreground">
                        L&apos;authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte.
                        Pour désactiver la 2FA, saisissez votre mot de passe ci-dessous.
                     </p>
                  </div>
               </div>
               <div className="mt-4 space-y-3">
                  <Label htmlFor="disable-password">Saisissez votre mot de passe pour désactiver la 2FA</Label>
                  <Input
                     id="disable-password"
                     type="password"
                     placeholder="Votre mot de passe"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     disabled={isLoading}
                  />
               </div>
            </CardContent>
            <CardFooter>
               <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDisable}
                  disabled={!password || isLoading}
               >
                  {isLoading ? "Désactivation..." : "Désactiver la 2FA"}
               </Button>
            </CardFooter>
         </Card>
      )
   }

   // ── Show QR code + backup codes after enable ────────
   if (step === "qr" && totpUri) {
      return (
         <Card>
            <CardHeader className="text-center">
               <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Smartphone className="h-7 w-7 text-primary" />
               </div>
               <CardTitle className="text-xl">Scannez le QR Code</CardTitle>
               <CardDescription>
                  Scannez ce QR code avec votre application d&apos;authentification (Google Authenticator, Authy, etc.)
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex justify-center">
                  {qrDataUrl ? (
                     <div className="rounded-xl border-2 border-border bg-white p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                           src={qrDataUrl}
                           alt="QR Code"
                           width={200}
                           height={200}
                           className="rounded-lg"
                        />
                     </div>
                  ) : (
                     <div className="flex h-52 w-52 items-center justify-center rounded-xl border-2 border-border bg-muted">
                        <p className="text-sm text-muted-foreground">Génération du QR code...</p>
                     </div>
                  )}
               </div>

               {backupCodes.length > 0 && (
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Codes de secours</Label>
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={copyBackupCodes}
                           className="h-8 gap-1.5 text-xs"
                        >
                           {copiedCodes ? (
                              <Check className="h-3.5 w-3.5 text-green-500" />
                           ) : (
                              <Copy className="h-3.5 w-3.5" />
                           )}
                           {copiedCodes ? "Copiés" : "Copier"}
                        </Button>
                     </div>
                     <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                           {backupCodes.map((code, i) => (
                              <div
                                 key={i}
                                 className="rounded bg-background px-2.5 py-1.5 text-center text-foreground"
                              >
                                 {code}
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <p className="text-xs text-muted-foreground">
                           Conservez ces codes de secours dans un endroit sûr. Vous pourrez les utiliser pour vous connecter
                           si vous perdez l&apos;accès à votre application d&apos;authentification.
                        </p>
                     </div>
                  </div>
               )}

               <div className="space-y-2">
                  <Label htmlFor="verify-code">Saisissez le code à 6 chiffres de votre application</Label>
                  <div className="flex justify-center">
                     <InputOTP
                        maxLength={6}
                        value={totpCode}
                        onChange={setTotpCode}
                        disabled={isLoading}
                     >
                        <InputOTPGroup>
                           <InputOTPSlot index={0} />
                           <InputOTPSlot index={1} />
                           <InputOTPSlot index={2} />
                           <InputOTPSlot index={3} />
                           <InputOTPSlot index={4} />
                           <InputOTPSlot index={5} />
                        </InputOTPGroup>
                     </InputOTP>
                  </div>
               </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
               <Button
                  className="w-full"
                  onClick={handleVerify}
                  disabled={totpCode.length !== 6 || isLoading}
               >
                  {isLoading ? "Vérification..." : "Vérifier et activer la 2FA"}
               </Button>
               <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleCancel}
                  disabled={isLoading}
               >
                  Annuler
               </Button>
            </CardFooter>
         </Card>
      )
   }

   // ── Show "Done" state after successful setup ────────
   if (step === "done") {
      return (
         <Card>
            <CardHeader className="text-center">
               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <Check className="h-8 w-8 text-green-500" />
               </div>
               <CardTitle className="text-xl">2FA Activée !</CardTitle>
               <CardDescription>
                  Votre compte est maintenant protégé par l&apos;authentification à deux facteurs.
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {backupCodes.length > 0 && (
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Codes de secours</Label>
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={copyBackupCodes}
                           className="h-8 gap-1.5 text-xs"
                        >
                           {copiedCodes ? (
                              <Check className="h-3.5 w-3.5 text-green-500" />
                           ) : (
                              <Copy className="h-3.5 w-3.5" />
                           )}
                           {copiedCodes ? "Copiés" : "Copier"}
                        </Button>
                     </div>
                     <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                           {backupCodes.map((code, i) => (
                              <div
                                 key={i}
                                 className="rounded bg-background px-2.5 py-1.5 text-center text-foreground"
                              >
                                 {code}
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <p className="text-xs text-muted-foreground">
                           Conservez ces codes de secours dans un endroit sûr — ils ne seront plus affichés.
                        </p>
                     </div>
                  </div>
               )}
            </CardContent>
            <CardFooter>
               <Button className="w-full" onClick={() => { setStep("idle"); setPassword("") }}>
                  Terminé
               </Button>
            </CardFooter>
         </Card>
      )
   }

   // ── Default: Show enable form (password confirmation) ─
   return (
      <Card>
         <CardHeader>
            <div className="flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShieldOff className="h-5 w-5 text-muted-foreground" />
               </div>
               <div>
                  <CardTitle className="text-lg">Authentification à deux facteurs</CardTitle>
                  <CardDescription>
                     Ajoutez une couche de sécurité supplémentaire à votre compte
                  </CardDescription>
               </div>
            </div>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
               <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                  <div className="space-y-2 text-sm text-muted-foreground">
                     <p>
                        Une fois la 2FA activée, vous devrez saisir un code depuis votre
                     application d&apos;authentification à chaque connexion.
                     </p>
                     <ul className="list-inside list-disc space-y-1">
                        <li>Téléchargez une application d&apos;authentification comme Google Authenticator ou Authy</li>
                        <li>Scannez le QR code affiché lors de la configuration</li>
                        <li>Saisissez le code à 6 chiffres pour vérifier</li>
                     </ul>
                  </div>
               </div>
            </div>
            <div className="space-y-2">
               <Label htmlFor="enable-password">Saisissez votre mot de passe pour continuer</Label>
               <Input
                  id="enable-password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
               />
            </div>
         </CardContent>
         <CardFooter>
            <Button
               className="w-full"
               onClick={handleStartEnable}
               disabled={!password || isLoading}
            >
               {isLoading ? "Configuration..." : "Activer la 2FA"}
            </Button>
         </CardFooter>
      </Card>
   )
}
