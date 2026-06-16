"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import FadeInView from "./animate-ui/fade-in-view"

// Hazard-stripe + blueprint-grid. Signature de chantier : la bande hi-vis est
// le seul élément "fort", tout le reste reste calme (règle Chanel : un seul
// accessoire). Hi-vis orange = --primary.
const HAZARD_STRIPE =
   "repeating-linear-gradient(135deg, var(--primary) 0 14px, transparent 14px 28px)"

// Grille blueprint discrète, atténuée vers les bords par un masque radial.
const BLUEPRINT_GRID =
   "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)"

export default function HeroSection() {
   return (
      <section className="relative overflow-hidden">
         {/* Fond blueprint — atmosphère chantier, volontairement discret. */}
         <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
               backgroundImage: BLUEPRINT_GRID,
               backgroundSize: "48px 48px",
               maskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 35%, #000 40%, transparent 100%)",
               WebkitMaskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 35%, #000 40%, transparent 100%)",
            }}
         />

         <div className="container relative flex flex-col items-center gap-6 py-20 text-center md:py-28 lg:py-36">
            {/* Eyebrow façon panneau de chantier — mono, en majuscules. */}
            <FadeInView>
               <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary sm:text-sm">
                  <span className="h-2 w-2 bg-primary" aria-hidden />
                  Matériel BTP · réservation immédiate
               </span>
            </FadeInView>

            {/* Vrai <h1> : la police display (Bricolage) + le tracking de
                globals.css ne s'appliquaient pas tant que c'était un <div>. */}
            <FadeInView delay={0.15}>
               <h1 className="text-balance text-4xl font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl">
                  Réservez vos outils
                  <br />
                  de <span className="text-primary">chantier</span> en un clic.
               </h1>
            </FadeInView>

            <FadeInView
               delay={0.3}
               className="max-w-[40rem] text-pretty text-base leading-relaxed text-muted-foreground sm:text-xl"
            >
               Un catalogue complet d&apos;outils de chantier, prêts à partir.
               Vous cherchez quelque chose de précis ? Vous le trouverez ici.
            </FadeInView>

            <FadeInView delay={0.45} className="flex flex-wrap items-center justify-center gap-3 pt-2">
               <Button asChild size="lg" className="group">
                  <Link href="/materiel">
                     Voir le matériel
                     <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
               </Button>
            </FadeInView>
         </div>

         {/* Bande de danger hi-vis — la signature de la page. */}
         <div
            aria-hidden
            className="h-3 w-full"
            style={{ backgroundImage: HAZARD_STRIPE }}
         />
      </section>
   )
}
