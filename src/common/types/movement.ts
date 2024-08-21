import {Movement} from '@prisma/client';

export type Movements = {
  id: string;
  movementType: 'SELL' | 'ADD_TO_STOCK' | 'REMOVE_FROM_STOCK';
  quantity: number;
  productId: number;
  userId: string;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
};

export type TCreateMovementInput = Omit<
  Movement,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
