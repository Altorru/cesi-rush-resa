/*
  Warnings:

  - Added the required column `category` to the `equipment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EquipmentCategory" AS ENUM ('PERCAGE_FIXATION', 'DECOUPE', 'MACONNERIE', 'PEINTURE_FINITION', 'ELECTRIQUE_ENERGIE', 'LEVAGE_MANUTENTION', 'MESURE_CONTROLE', 'EXTERIEUR_TERRASSEMENT', 'NETTOYAGE');

-- AlterTable
ALTER TABLE "equipment" DROP COLUMN "category",
ADD COLUMN     "category" "EquipmentCategory" NOT NULL;
