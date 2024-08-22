/*
  Warnings:

  - You are about to alter the column `unitPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(1000,2)`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "unitPrice" SET DATA TYPE DECIMAL(1000,2);
