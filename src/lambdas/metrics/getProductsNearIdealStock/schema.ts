import {Prisma} from '@prisma/client';
import {z} from 'zod';

export const requestSchema = z.object({
  pathParameters: z.object({
    userId: z.string(),
  }),
  queryStringParameters: z.object({
    productName: z.string().optional(),
    page: z.union([z.number().int().positive(), z.string()]),
    pageSize: z.union([z.number().int().positive(), z.string()]),
    orderBy: z.enum([Prisma.SortOrder.asc, Prisma.SortOrder.desc]).optional(),
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
      page: z.number(),
      pageSize: z.number(),
      totalProducts: z.number(),
      totalPages: z.number(),
      productsNearIdealStock: z
        .object({
          id: z.string(),
          name: z.string(),
          image: z.string().nullable(),
          stockQuantity: z.number(),
          minimumIdealStock: z.number(),
        })
        .array(),
      message: z.string(),
    }),
  }),
  404: z.object({
    statusCode: z.number(),
    body: z.object({
      message: z.string(),
    }),
  }),
};
