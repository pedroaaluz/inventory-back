import {z} from 'zod';

export const requestSchema = z.object({
  queryStringParameters: z.object({
    name: z.string().optional(),
  }),
});

export const responseSchema = {
  200: z.object({
    statusCode: z.number(),
    body: z.object({
      message: z.string(),
      categories: z.array(
        z.object({
          name: z.string(),
          id: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
          deletedAt: z.date().nullable(),
        }),
      ),
    }),
  }),
};
