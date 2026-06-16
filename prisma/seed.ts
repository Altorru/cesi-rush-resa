import { PrismaClient } from "@prisma/client";
import type { EquipmentCategory } from "@prisma/client";

const prisma = new PrismaClient();

// Catalogue fictif de matériel BTP. Les outils sont repris des listes
// d'Alyssa sur la home (par catégorie) → la home dynamique et le catalogue
// affichent exactement le même matériel.
const catalogue: { category: EquipmentCategory; items: string[] }[] = [
   {
      category: "PERCAGE_FIXATION",
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
      category: "DECOUPE",
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
      category: "MACONNERIE",
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
      category: "PEINTURE_FINITION",
      items: [
         "Ponceuse orbitale",
         "Ponceuse à bande",
         "Pistolet à peinture",
         "Décapeur thermique",
         "Mélangeur à peinture",
      ],
   },
   {
      category: "ELECTRIQUE_ENERGIE",
      items: [
         "Groupe électrogène",
         "Enrouleur électrique",
         "Projecteur de chantier LED",
         "Batterie portable de chantier",
         "Compresseur d'air",
      ],
   },
   {
      category: "LEVAGE_MANUTENTION",
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
      category: "MESURE_CONTROLE",
      items: [
         "Télémètre laser",
         "Niveau laser rotatif",
         "Détecteur de matériaux",
         "Caméra thermique",
         "Luxmètre",
      ],
   },
   {
      category: "EXTERIEUR_TERRASSEMENT",
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
      category: "NETTOYAGE",
      items: [
         "Aspirateur industriel",
         "Nettoyeur haute pression",
         "Balayeuse industrielle",
         "Injecteur-extracteur",
      ],
   },
];

async function main() {
   const existing = await prisma.equipment.count();
   if (existing > 0) {
      console.log(`Catalogue déjà peuplé (${existing} équipements). Seed ignoré.`);
      return;
   }

   // Aplatit le catalogue ; quantité variée mais déterministe (1 à 4).
   const data = catalogue.flatMap((cat, ci) =>
      cat.items.map((name, i) => ({
         name,
         category: cat.category,
         quantity: ((ci + i) % 4) + 1,
      })),
   );

   await prisma.equipment.createMany({ data });
   console.log(`Seed terminé : ${data.length} équipements créés.`);
}

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
