import {z} from 'zod';

export const requestSchema = z.object({
  body: z.object({
    name: z.string(),
    cnpj: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    userId: z.string(),
    image: z.string().optional(),
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
      message: z.string(),
      supplier: z.object({
        id: z.string(),
        name: z.string(),
        cnpj: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        email: z.string().optional().nullable(),
        userId: z.string(),
        image: z.string().optional().nullable(),
        createdAt: z.union([z.string(), z.string()]),
        deletedAt: z.union([z.string(), z.string()]).nullable(),
        updatedAt: z.union([z.string(), z.string()]),
      }),
    }),
  }),
};
