import z from 'zod';
import {EnumMovementsType, EnumPaymentMethodType, Prisma} from '@prisma/client';

const decimalSchema = z.custom<Prisma.Decimal>(value => {
  return new Prisma.Decimal(value as string | number);
});

export const requestSchema = z.object({
  queryStringParameters: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.number().int().positive().optional(),
    pageSize: z.number().int().positive().optional(),
    orderBy: z.enum([Prisma.SortOrder.asc, Prisma.SortOrder.desc]).optional(),
    productsIds: z.string().array().optional(),
    productName: z.string().optional(),
  }),
  pathParameters: z.object({
    userId: z.string(),
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
      message: z.string(),
      page: z.number(),
      pageSize: z.number(),
      totalMovements: z.number(),
      totalPages: z.number(),
      movements: z
        .object({
          id: z.string(),
          movementType: z.nativeEnum(EnumMovementsType),
          quantity: z.number(),
          productId: z.string(),
          productName: z.string(),
          productNameNormalized: z.string(),
          userId: z.string(),
          createdAt: z.date(),
          deletedAt: z.date().nullable(),
          updatedAt: z.date(),
          movementValue: decimalSchema.nullable(),
          paymentMethod: z.nativeEnum(EnumPaymentMethodType).nullable(),
          productImage: z.string().nullable(),
        })
        .array(),
    }),
  }),
};
