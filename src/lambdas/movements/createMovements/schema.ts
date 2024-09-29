import {z} from 'zod';
import {EnumMovementsType, EnumPaymentMethodType, Prisma} from '@prisma/client';

const decimalSchema = z.custom<Prisma.Decimal>(value => {
  return new Prisma.Decimal(value as string | number);
});

const movementSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  type: z.nativeEnum(EnumMovementsType),
  cost: decimalSchema.optional(),
  paymentMethod: z.nativeEnum(EnumPaymentMethodType).optional(),
});

export const requestSchema = z.object({
  body: z.object({movements: z.array(movementSchema)}),
  pathParameters: z.object({
    userId: z.string(),
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
      message: z.string(),
      movementsCreated: z.array(
        z.object({
          productId: z.string(),
          quantity: z.number(),
          movementType: z.nativeEnum(EnumMovementsType),
          movementValue: decimalSchema.nullable(),
          paymentMethod: z.nativeEnum(EnumPaymentMethodType).nullable(),
        }),
      ),
      movementsInvalid: z.array(
        z.object({
          productId: z.string(),
          movementType: z.string(),
          quantity: z.number(),
          quantityCurrent: z.number(),
          movementValue: decimalSchema.optional(),
          message: z.string(),
        }),
      ),
    }),
  }),
};
