import {ProductSupplier} from '@prisma/client';

export type TCreateProductSupplierInput = Omit<
  ProductSupplier,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
