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
      const toastId = toast.loading("Preparing 2FA setup...")

      try {
         const { data, error } = await authClient.twoFactor.enable({
            password,
         })

         toast.dismiss(toastId)

         if (error) {
            toast.error(error.message || "Incorrect password")
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
         toast.error("Something went wrong")
      }

      setIsLoading(false)
   }

   // ── Verify TOTP code to complete setup ──────────────
   async function handleVerify() {
      if (totpCode.length !== 6) {
         toast.error("Please enter a valid 6-digit code")
         return
      }

      setIsLoading(true)
      const toastId = toast.loading("Verifying code...")

      try {
         const { error } = await authClient.twoFactor.verifyTotp({
            code: totpCode,
         })

         toast.dismiss(toastId)

         if (error) {
            toast.error(error.message || "Invalid code. Try again.")
            setIsLoading(false)
            return
         }

         setIsEnabled(true)
         setStep("done")
         setUser((prev) =>
            prev ? { ...prev, twoFactorEnabled: true } : prev
         )
         toast.success("2FA enabled successfully!")
      } catch {
         toast.dismiss(toastId)
         toast.error("Something went wrong")
      }

      setIsLoading(false)
   }

   // ── Disable 2FA ─────────────────────────────────────
   async function handleDisable() {
      if (!password) {
         toast.error("Please enter your password")
         return
      }

      setIsLoading(true)
      const toastId = toast.loading("Disabling 2FA...")

      try {
         const { error } = await authClient.twoFactor.disable({
            password,
         })

         toast.dismiss(toastId)

         if (error) {
            toast.error(error.message || "Incorrect password")
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
         toast.success("2FA disabled successfully")
      } catch {
         toast.dismiss(toastId)
         toast.error("Something went wrong")
      }

      setIsLoading(false)
   }

   // ── Copy backup codes ───────────────────────────────
   function copyBackupCodes() {
      navigator.clipboard.writeText(backupCodes.join("\n"))
      setCopiedCodes(true)
      toast.success("Backup codes copied to clipboard")
      setTimeout(() => setCopiedCodes(false), 2000)
   }

   // ── Cancel / Reset ──────────────────────────────────
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
                        <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                        <CardDescription>Your account is protected with 2FA</CardDescription>
                     </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                     <Check className="mr-1 h-3 w-3" />
                     Enabled
                  </Badge>
               </div>
            </CardHeader>
            <CardContent>
               <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                     <AlertCircle className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                     <p className="text-sm text-muted-foreground">
                        Two-factor authentication adds an extra layer of security to your account.
                        To disable 2FA, enter your password below.
                     </p>
                  </div>
               </div>
               <div className="mt-4 space-y-3">
                  <Label htmlFor="disable-password">Enter your password to disable 2FA</Label>
                  <Input
                     id="disable-password"
                     type="password"
                     placeholder="Your password"
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
                  {isLoading ? "Disabling..." : "Disable 2FA"}
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
               <CardTitle className="text-xl">Scan QR Code</CardTitle>
               <CardDescription>
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
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
                        <p className="text-sm text-muted-foreground">Generating QR code...</p>
                     </div>
                  )}
               </div>

               {backupCodes.length > 0 && (
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Backup Codes</Label>
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
                           {copiedCodes ? "Copied" : "Copy"}
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
                           Save these backup codes in a safe place. You can use them to sign in
                           if you lose access to your authenticator app.
                        </p>
                     </div>
                  </div>
               )}

               <div className="space-y-2">
                  <Label htmlFor="verify-code">Enter the 6-digit code from your app</Label>
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
                  {isLoading ? "Verifying..." : "Verify & Enable 2FA"}
               </Button>
               <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleCancel}
                  disabled={isLoading}
               >
                  Cancel
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
               <CardTitle className="text-xl">2FA Enabled!</CardTitle>
               <CardDescription>
                  Your account is now protected with two-factor authentication.
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {backupCodes.length > 0 && (
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Backup Codes</Label>
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
                           {copiedCodes ? "Copied" : "Copy"}
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
                           Save these backup codes in a safe place — they won&apos;t be shown again.
                        </p>
                     </div>
                  </div>
               )}
            </CardContent>
            <CardFooter>
               <Button className="w-full" onClick={() => { setStep("idle"); setPassword("") }}>
                  Done
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
                  <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                  <CardDescription>
                     Add an extra layer of security to your account
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
                        Once 2FA is enabled, you&apos;ll need to enter a code from your
                        authenticator app every time you sign in.
                     </p>
                     <ul className="list-inside list-disc space-y-1">
                        <li>Download an authenticator app like Google Authenticator or Authy</li>
                        <li>Scan the QR code displayed during setup</li>
                        <li>Enter the 6-digit code to verify</li>
                     </ul>
                  </div>
               </div>
            </div>
            <div className="space-y-2">
               <Label htmlFor="enable-password">Enter your password to continue</Label>
               <Input
                  id="enable-password"
                  type="password"
                  placeholder="Your password"
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
               {isLoading ? "Setting up..." : "Enable 2FA"}
            </Button>
         </CardFooter>
      </Card>
   )
}
