import {z} from 'zod';
import {Prisma} from '@prisma/client';

const decimalSchema = z.custom<Prisma.Decimal>(value => {
  return new Prisma.Decimal(value as string | number);
});

export const requestSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    stockQuantity: z.number().int().nonnegative().optional(),
    unitPrice: decimalSchema.optional(),
    expirationDate: z.date().optional(),
    userId: z.string(),
    image: z.string().optional(),
    positionInStock: z.string().optional(),
    minimumIdealStock: z.number().int().optional(),
    productionCost: decimalSchema.optional(),
    categoriesIds: z.array(z.string()).optional(),
    suppliersIds: z.array(z.string()).optional(),
  }),
  pathParameters: z.object({
    id: z.string(),
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
      message: z.string(),
      product: z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable(),
        description: z.string().nullable(),
        stockQuantity: z.number(),
        unitPrice: decimalSchema,
        positionInStock: z.string().nullable(),
        expirationDate: z.date().nullable(),
        createdAt: z.union([z.string(), z.date()]),
        deletedAt: z.union([z.string(), z.date()]).nullable(),
        updatedAt: z.union([z.string(), z.date()]),
      }),
    }),
  }),
};
