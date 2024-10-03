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
      paymentMethodUsed: z.object({
        creditCard: z.number(),
        debitCard: z.number(),
        cash: z.number(),
        pix: z.number(),
      }),
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
