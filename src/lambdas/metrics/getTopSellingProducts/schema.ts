import {z} from 'zod';

export const requestSchema = z.object({
  pathParameters: z.object({
    userId: z.string(),
  }),
  queryStringParameters: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.string().optional(),
    pageSize: z.string().optional(),
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
      products: z
        .object({
          salesCount: z.number(),
          salesValue: z.number(),
          productName: z.string(),
          productId: z.string(),
          productImage: z.string().nullable(),
          stockQuantity: z.number(),
        })
        .array(),
      message: z.string(),
      totalPages: z.number(),
      page: z.number(),
      pageSize: z.number(),
      totalProducts: z.number(),
    }),
  }),
  404: z.object({
    statusCode: z.number(),
    body: z.object({
      message: z.string(),
    }),
  }),
};
