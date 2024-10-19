import {ProductSupplier} from '@prisma/client';

export type TUpsertProductSupplierInput = Omit<
  ProductSupplier,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export interface IDeleteProductSupplierRepository {
  productId: string;
  suppliersIds: string[];
}
