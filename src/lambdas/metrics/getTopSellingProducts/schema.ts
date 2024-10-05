import {z} from 'zod';

export const requestSchema = z.object({
  pathParameters: z.object({
    userId: z.string(),
  }),
  queryStringParameters: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
      products: z
        .object({
          count: z.number(),
          productName: z.string(),
          productId: z.string(),
          productImage: z.string().nullable(),
          stockQuantity: z.number(),
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
