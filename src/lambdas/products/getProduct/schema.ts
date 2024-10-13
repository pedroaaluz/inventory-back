import {z} from 'zod';

export const requestSchema = z.object({
  pathParameters: z.object({
    id: z.string(),
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
      product: z
        .object({
          id: z.string(),
          name: z.string(),
          categoryId: z.array(z.string()),
          supplierId: z.array(z.string()),
          image: z.string().nullable(),
          description: z.string().nullable(),
          stockQuantity: z.number(),
          unitPrice: z.number(),
          positionInStock: z.string().nullable(),
          expirationDate: z.date().nullable(),
          createdAt: z.date(),
          deletedAt: z.date().nullable(),
          updatedAt: z.date(),
          productionCost: z.number(),
          minimumIdealStock: z.number().nullable(),
        })
        .nullable()
        .optional(),
    }),
  }),
  404: z.object({
    statusCode: z.number(),
    body: z.object({
      message: z.string(),
    }),
  }),
};
