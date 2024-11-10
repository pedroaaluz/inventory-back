import {z} from 'zod';

export const requestSchema = z.object({
  pathParameters: z.object({
    userId: z.string(), // eu sei, mas o apigateway não sabe
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
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
