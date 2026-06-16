"use client"

import {
   Card,
   CardContent,
   CardHeader
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, Mail, Shield, ShieldOff } from "lucide-react"
import { useUser } from "@/context/UserContext"

export default function ProfileCard() {
   const user = useUser();
   return (
      <Card className="overflow-hidden">
         <CardHeader className="relative p-0">
            <div className="h-24 sm:h-32 bg-gradient-to-r from-primary/20 to-primary/40"></div>
            <div className="absolute -bottom-10 sm:-bottom-12 left-3 sm:left-4">
               <div className="relative">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background">
                     <AvatarImage src={user?.image || ''} alt="John Doe" />
                     <AvatarFallback className="text-4xl sm:text-6xl font-bold">
                        {user?.name?.charAt(0)}
                     </AvatarFallback>
                  </Avatar>
               </div>
            </div>
         </CardHeader>
         <CardContent className="pt-12 sm:pt-14">
            <div className="space-y-1">
               <h3 className="font-semibold text-xl">
                  {user?.name}
               </h3>
               <p className="text-sm text-muted-foreground">
                  {user?.email}
               </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4">
               <Badge variant="outline" className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  {user?.emailVerified ? 'Vérifié' : 'Non vérifié'}
               </Badge>
               <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Membre depuis {user?.createdAt?.getFullYear()}
               </Badge>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
               <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                     <p className="text-sm font-medium">Adresse email</p>
                     <p className="text-sm text-muted-foreground">
                        {user?.email}
                     </p>
                  </div>
               </div>
               <div className="flex items-start gap-2">
                  {user?.twoFactorEnabled ? (
                     <Shield className="h-4 w-4 text-green-500 mt-0.5" />
                  ) : (
                     <ShieldOff className="h-4 w-4 text-muted-foreground mt-0.5" />
                  )}
                  <div>
                     <p className="text-sm font-medium">Sécurité du compte</p>
                     <p className="text-sm text-muted-foreground">
                        {user?.twoFactorEnabled ? '2FA Activée' : '2FA Désactivée'}
                     </p>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
   )
}
