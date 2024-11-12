/*
  Warnings:

  - You are about to drop the column `productName` on the `Movement` table. All the data in the column will be lost.
  - You are about to drop the column `productNameNormalized` on the `Movement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movement" DROP COLUMN "productName",
DROP COLUMN "productNameNormalized";
