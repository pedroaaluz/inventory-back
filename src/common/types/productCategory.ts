import {ProductCategory} from '@prisma/client';

export type TUpsertProductCategoryInput = Omit<
  ProductCategory,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export interface IDeleteProductCategoryRepository {
  productId: string;
  categoriesIds?: string[];
}
