import {z} from 'zod';

export const requestSchema = z.object({
  pathParameters: z.object({
    userId: z.string(),
  }),
  queryStringParameters: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    productName: z.string().optional(),
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
      productsNearIdealStock: z
        .object({
          id: z.string(),
          name: z.string(),
          image: z.string().nullable(),
          stockQuantity: z.number(),
          minimumIdealStock: z.number(),
          supplierEmail: z.string().nullable(),
          supplierPhone: z.string().nullable(),
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
