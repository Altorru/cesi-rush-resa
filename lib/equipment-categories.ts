import type { EquipmentCategory } from "@prisma/client";

// Source unique des libellés FR des catégories d'outils (repris de la home
// d'Alyssa). Réutilisé par le catalogue, le tri et la home. Pas de JSX ici
// pour rester importable côté serveur ET dans le seed (les icônes lucide
// vivent dans le composant home).
export const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
   PERCAGE_FIXATION: "Outils de perçage et fixation",
   DECOUPE: "Outils de découpe",
   MACONNERIE: "Outils pour maçonnerie",
   PEINTURE_FINITION: "Outils pour peinture et finition",
   ELECTRIQUE_ENERGIE: "Outils électriques et énergie",
   LEVAGE_MANUTENTION: "Équipement de levage et manutention",
   MESURE_CONTROLE: "Outils de mesure et contrôle",
   EXTERIEUR_TERRASSEMENT: "Outils d'extérieur et terrassement",
   NETTOYAGE: "Nettoyage de chantier",
};

// Ordre d'affichage (identique à la home d'origine).
export const CATEGORY_ORDER: EquipmentCategory[] = [
   "PERCAGE_FIXATION",
   "DECOUPE",
   "MACONNERIE",
   "PEINTURE_FINITION",
   "ELECTRIQUE_ENERGIE",
   "LEVAGE_MANUTENTION",
   "MESURE_CONTROLE",
   "EXTERIEUR_TERRASSEMENT",
   "NETTOYAGE",
];
