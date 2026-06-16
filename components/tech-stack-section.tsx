import { Drill, Scissors, Layers, Paintbrush, Zap, Truck, Ruler, Shovel, Trash2 } from 'lucide-react'
import React from 'react'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import FadeInView from './animate-ui/fade-in-view';


const stack = [
   {
      name: "Outils de perçage et fixation",
      icon: <Drill className="h-6 w-6 text-primary" />,
      description: "Dans cette catégorie, vous pourrez retrouver les outils suivants :",
      items: [
         "Perceuse-visseuse sans fil",
         "Perceuse à percussion",
         "Marteau-piqueur",
         "Perforateur burineur",
         "Cloueuse pneumatique",
         "Visseuse à chocs",
      ],
   },
   {
      name: "Outils de découpe",
      icon: <Scissors className="h-6 w-6 text-primary" />,
      description: "Dans cette catégorie, vous pourrez retrouver les outils suivants :",
      items: [
         "Scie circulaire",
         "Scie sauteuse",
         "Scie sabre",
         "Tronçonneuse",
         "Meuleuse d'angle",
         "Coupe-carrelage électrique",
      ],
   },
   {
      name: "Outils pour maçonnerie",
      icon: <Layers className="h-6 w-6 text-primary" />,
      description: "Dans cette catégorie, vous pourrez retrouver les outils suivants :",
      items: [
         "Bétonnière",
         "Taloche mécanique",
         "Aiguille vibrante pour béton",
         "Malaxeur à mortier",
         "Niveau laser",
         "Règle vibrante",
      ],
   },
   {
      name: "Outils pour peinture et finition",
      icon: <Paintbrush className="h-6 w-6 text-primary" />,
      description: "Dans cette catégorie, vous pourrez retrouver les outils suivants :",
      items: [
         "Ponceuse orbitale",
         "Ponceuse à bande",
         "Pistolet à peinture",
         "Décapeur thermique",
         "Mélangeur à peinture",
      ],
   },
   {
      name: "Outils électriques et énergie",
      icon: <Zap className="h-6 w-6 text-primary" />,
      description: "Dans cette catégorie, vous pourrez retrouver les outils suivants :",
      items: [
         "Groupe électrogène",
         "Enrouleur électrique",
         "Projecteur de chantier LED",
         "Batterie portable de chantier",
         "Compresseur d'air",
      ],
   },
   {
      name: "Équipement de levage et manutention",
      icon: <Truck className="h-6 w-6 text-primary" />,
      description: "Dans cette catégorie, vous pourrez retrouver les outils suivants :",
      items: [
         "Diable",
         "Transpalette",
         "Treuil électrique",
         "Palan",
         "Chariot de transport",
         "Monte-matériaux",
      ],
   },
   {
      name: "Outils de mesure et contrôle",
      icon: <Ruler className="h-6 w-6 text-primary" />,
      description: "Dans cette catégorie, vous pourrez retrouver les outils suivants :",
      items: [
         "Télémètre laser",
         "Niveau laser rotatif",
         "Détecteur de matériaux",
         "Caméra thermique",
         "Luxmètre",
      ],
   },
   {
      name: "Outils d'extérieur et terrassement",
      icon: <Shovel className="h-6 w-6 text-primary" />,
      description: "Dans cette catégorie, vous pourrez retrouver les outils suivants :",
      items: [
         "Tarière thermique",
         "Motobineuse",
         "Débroussailleuse",
         "Taille-haie",
         "Souffleur de feuilles",
         "Plaque vibrante",
      ],
   },
   {
      name: "Nettoyage de chantier",
      icon: <Trash2 className="h-6 w-6 text-primary" />,
      description: "Dans cette catégorie, vous pourrez retrouver les outils suivants :",
      items: [
         "Aspirateur industriel",
         "Nettoyeur haute pression",
         "Balayeuse industrielle",
         "Injecteur-extracteur",
      ],
   },
]

export default function TechStackSection() {

   return (
      <section className="pb-12 sm:pb-20 md:pb-32 pt-12 sm:pt-20 md:pt-32 container mx-auto">
         <FadeInView className="text-center space-y-3 sm:space-y-4 pb-10 sm:pb-16 mx-auto max-w-4xl">
            <Badge className='px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium'>Outils</Badge>
            <h2 className="mx-auto mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl tracking-tight">
               Catégorie d&apos;outils
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground pt-1">
               Découvrez notre large gamme d&apos;outils de chantier
            </p>
         </FadeInView>

         <Card className="grid divide-x divide-y overflow-hidden rounded-2xl sm:rounded-3xl border border-card sm:grid-cols-2 lg:grid-cols-3 lg:divide-y-0">
            {stack.map((item, index) => (
               <FadeInView
                  key={index}
                  delay={0.1 * (index + 2)}
                  className="group relative transition-shadow duration-300 hover:z-[1] hover:shadow-2xl hover:shadow-primary"
               >
                  <div className="relative space-y-6 sm:space-y-8 py-8 sm:py-12 px-5 sm:p-8">
                     <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-primary/10">
                        {item.icon}
                     </div>
                     <div className="space-y-2">
                        <h5 className="text-lg sm:text-xl text-muted-foreground font-semibold transition group-hover:text-primary">
                           {item.name}
                        </h5>
                        <div className="text-muted-foreground">
                           <p>{item.description}</p>
                           {item.items && (
                              <ul className="list-disc list-inside mt-2 space-y-1">
                                 {item.items.map((tool, i) => (
                                    <li key={i}>{tool}</li>
                                 ))}
                              </ul>
                           )}
                        </div>
                     </div>
                  </div>
               </FadeInView>
            ))}
         </Card>
      </section>
   )
}