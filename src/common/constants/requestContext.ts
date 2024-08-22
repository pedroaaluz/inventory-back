import {z} from 'zod';

export const requestContext = z.object({
  authorizer: z.object({
    principalId: z.string(),
    principalInfos: z.object({
      group: z.string(),
      types: z.string().array(),
      organizationGroups: z.string().array(),
    }),
  }),
});
