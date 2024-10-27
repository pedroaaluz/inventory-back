import {z} from 'zod';

export const requestSchema = z.object({
  pathParameters: z.object({
    userId: z.string(),
  }),
  queryStringParameters: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    productName: z.string().optional(),
    page: z.union([z.number().int().positive(), z.string()]),
    pageSize: z.union([z.number().int().positive(), z.string()]),
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
      products: z
        .object({
          id: z.string(),
          name: z.string(),
          image: z.string().nullable(),
          totalSales: z.number(),
          stockQuantity: z.number(),
          averageConsumption: z.number(),
          stockCoverage: z.number(),
          turnoverRate: z.number(),
          minimumIdealStock: z.number(),
        })
        .array(),
      message: z.string(),
      totalCount: z.number(),
      page: z.number(),
      pageSize: z.number(),
      totalPages: z.number(),
    }),
  }),
  404: z.object({
    statusCode: z.number(),
    body: z.object({
      message: z.string(),
    }),
  }),
};
