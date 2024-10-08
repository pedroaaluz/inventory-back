import {z} from 'zod';
import {Prisma} from '@prisma/client';

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
      totalSuppliers: z.number(),
      totalPages: z.number(),
      suppliers: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          nameNormalized: z.string(),
          userId: z.string(),
          address: z.string().nullable(),
          phone: z.string().nullable(),
          email: z.string().nullable(),
          cnpj: z.string().nullable(),
          image: z.string().nullable(),
          createdAt: z.date(),
          updatedAt: z.date(),
          deletedAt: z.date().nullable(),
        }),
      ),
    }),
  }),
};
