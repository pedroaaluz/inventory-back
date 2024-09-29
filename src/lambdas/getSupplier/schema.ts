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
      supplier: z
        .object({
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
