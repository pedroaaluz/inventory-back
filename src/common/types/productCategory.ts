import {ProductCategory} from '@prisma/client';

export type TCreateProductCategoryInput = Omit<
  ProductCategory,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
