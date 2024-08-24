/*
  Warnings:

  - Added the required column `nameNormalized` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameNormalized` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "nameNormalized" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "nameNormalized" TEXT NOT NULL;
