import {z} from 'zod';
import {Prisma} from '@prisma/client';

const decimalSchema = z.custom<Prisma.Decimal>(value => {
  return new Prisma.Decimal(value as string | number);
});

export const requestSchema = z.object({
  queryStringParameters: z.object({
    name: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.union([
      z.number().int().positive().optional(),
      z.string().optional(),
    ]),
    pageSize: z.union([
      z.number().int().positive().optional(),
      z.string().optional(),
    ]),
    orderBy: z.enum([Prisma.SortOrder.asc, Prisma.SortOrder.desc]).optional(),
    userId: z.string(),
  }),
  multiValueQueryStringParameters: z.object({
    categoriesIds: z.array(z.string()).optional(),
    suppliersIds: z.array(z.string()).optional(),
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
      message: z.string(),
      page: z.number(),
      pageSize: z.number(),
      totalProducts: z.number(),
      totalPages: z.number(),
      products: z.array(
        z.object({
          nameNormalized: z.string(),
          name: z.string(),
          image: z.string().nullable(),
          description: z.string().nullable(),
          stockQuantity: z.number(),
          unitPrice: decimalSchema,
          positionInStock: z.string().nullable(),
          expirationDate: z.date().nullable(),
          createdAt: z.date(),
          updatedAt: z.date(),
          deletedAt: z.date().nullable(),
          categories: z.array(
            z.object({
              name: z.string(),
              id: z.string(),
            }),
          ),
          suppliers: z.array(
            z.object({
              name: z.string(),
              nameNormalized: z.string(),
              id: z.string(),
            }),
          ),
        }),
      ),
    }),
  }),
};
