import {ProductSupplier} from '@prisma/client';

export type TUpsertProductSupplierInput = Omit<
  ProductSupplier,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type TDeleteProductSupplierRepository =
  | {
      productId: string;
      suppliersIds: string[];
    }
  | {suppliersIds: string[]}
  | {productId: string};
