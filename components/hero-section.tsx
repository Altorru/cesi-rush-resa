"use client"

import { Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import FadeInView from "./animate-ui/fade-in-view";

export default function HeroSection() {
   return (
      <section className="relative space-y-6 py-12 md:py-20 lg:py-40">
         <div className="container flex flex-col items-center gap-4 text-center">
            <FadeInView className="container flex flex-col items-center gap-4 text-center">
               <Badge className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium">
                  <Sparkles className="mr-1.5 sm:mr-2 size-5 sm:size-8" />
                  RushResa ! Des outils à réserver au plus vite !
               </Badge>
            </FadeInView>
            <FadeInView delay={0.2} className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
               Réservez votre outils de chantier ici !
            </FadeInView>
            <FadeInView delay={0.4} className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
               Accédez à un énorme choix d&apos;outils de chantier en tout genre. Vous cherchez quelque chose de spécifique ? Vous le trouverez forcément ici !
            </FadeInView>
         </div>
      </section>
   );
}