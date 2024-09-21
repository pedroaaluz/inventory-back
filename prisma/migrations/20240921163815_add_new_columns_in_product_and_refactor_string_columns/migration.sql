/*
  Warnings:

  - You are about to alter the column `name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `productName` on the `Movement` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `productNameNormalized` on the `Movement` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `name` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `image` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `description` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `unitPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(1000,2)` to `Decimal(10,2)`.
  - You are about to alter the column `positionInStock` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `nameNormalized` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `name` on the `Supplier` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `address` on the `Supplier` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `phone` on the `Supplier` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `email` on the `Supplier` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `nameNormalized` on the `Supplier` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "name" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "Movement" ALTER COLUMN "productName" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "productNameNormalized" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "minimumIdealStock" INTEGER,
ADD COLUMN     "productionCost" DECIMAL(10,2),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "image" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "unitPrice" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "positionInStock" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "nameNormalized" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "name" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "nameNormalized" SET DATA TYPE VARCHAR(256);
