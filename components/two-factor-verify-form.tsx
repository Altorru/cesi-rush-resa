"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
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

export default function TwoFactorVerifyForm() {
   const router = useRouter()
   const [code, setCode] = useState("")
   const [trustDevice, setTrustDevice] = useState(false)
   const [isLoading, setIsLoading] = useState(false)

   async function onSubmit(e: React.FormEvent) {
      e.preventDefault()
      if (code.length !== 6) {
         toast.error("Please enter a valid 6-digit code")
         return
      }

      setIsLoading(true)
      const toastId = toast.loading("Verifying code...")

      try {
         const { error } = await authClient.twoFactor.verifyTotp({
            code,
            trustDevice,
         })

         toast.dismiss(toastId)

         if (error) {
            toast.error(error.message || "Invalid code. Please try again.")
            setIsLoading(false)
            return
         }

         toast.success("Verified successfully!")
         router.push("/dashboard")
      } catch {
         toast.dismiss(toastId)
         toast.error("Something went wrong. Please try again.")
         setIsLoading(false)
      }
   }

   return (
      <div className="flex min-h-screen items-center justify-center p-4">
         <Card className="w-full max-w-md">
            <CardHeader className="text-center">
               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
               </div>
               <CardTitle className="text-2xl font-bold">
                  Two-Factor Authentication
               </CardTitle>
               <CardDescription className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app to continue.
               </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
               <CardContent className="space-y-6">
                  <div className="flex justify-center">
                     <InputOTP
                        maxLength={6}
                        value={code}
                        onChange={(value) => setCode(value)}
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

                  <div className="flex items-center justify-center gap-3">
                     <Switch
                        id="trust-device"
                        checked={trustDevice}
                        onCheckedChange={setTrustDevice}
                        disabled={isLoading}
                     />
                     <Label htmlFor="trust-device" className="text-sm text-muted-foreground cursor-pointer">
                        Trust this device for 30 days
                     </Label>
                  </div>
               </CardContent>
               <CardFooter className="flex flex-col gap-3">
                  <Button
                     type="submit"
                     className="w-full"
                     disabled={code.length !== 6 || isLoading}
                  >
                     {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                  <Button
                     type="button"
                     variant="ghost"
                     className="w-full"
                     onClick={() => {
                        router.push("/sign-in")
                     }}
                     disabled={isLoading}
                  >
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Back to sign in
                  </Button>
               </CardFooter>
            </form>
         </Card>
      </div>
   )
}
