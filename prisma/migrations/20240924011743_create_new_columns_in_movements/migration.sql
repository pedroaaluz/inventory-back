-- AlterTable
ALTER TABLE "Movement" ADD COLUMN     "movementValue" DECIMAL(10,2),
ADD COLUMN     "paymentMethod" "EnumPaymentMethodType";
