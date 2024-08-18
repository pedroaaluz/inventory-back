import {z} from 'zod';

export const requestSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string().optional(),
    stockQuantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    expirationDate: z.date().optional(),
    supplierId: z.string(),
    userId: z.string(),
    categoryId: z.string(),
    image: z.string().optional(),
    positionInStock: z.string().optional(),
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
        unitPrice: z.number(),
        positionInStock: z.string().nullable(),
        expirationDate: z.date().nullable(),
        createdAt: z.date(),
        deletedAt: z.date().nullable(),
        updatedAt: z.date(),
      }),
    }),
  }),
};
