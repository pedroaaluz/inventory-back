import {Movement} from '@prisma/client';

export type TCreateMovementInput = Omit<
  Movement,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
