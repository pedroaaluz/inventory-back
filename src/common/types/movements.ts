export const EnumMovementsType: {
  SALE: 'SALE';
  ADD_TO_STOCK: 'ADD_TO_STOCK';
  REMOVE_FROM_STOCK: 'REMOVE_FROM_STOCK';
};

export type Movements = {
  id?: string;
  movementType: EnumMovementsType;
  quantity: number;
  productName: string;
  userId: string;
  createdAt?: Date | string;
  deletedAt?: Date | string | null;
  updatedAt?: Date | string;
};

export type MovementsInput = {
  movementType: 'SELL' | 'ADD_TO_STOCK' | 'REMOVE_FROM_STOCK';
  quantity: number;
  productId: number;
  userId: string;
};
