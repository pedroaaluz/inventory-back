import type {PrismaClient, ProductCategory} from '@prisma/client';
import {Repository} from '../../interfaces';
import {TUpsertProductCategoryInput} from '../../types/productCategory';

export class UpsertProductCategoryRepository
  implements Repository<TUpsertProductCategoryInput, ProductCategory[]>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(
    productCategoryDTO:
      | TUpsertProductCategoryInput
      | TUpsertProductCategoryInput[],
  ) {
    const productCategoryToUpdate = Array.isArray(productCategoryDTO)
      ? productCategoryDTO
      : [productCategoryDTO];

    const promise = productCategoryToUpdate.map(pc => {
      return this.dbClient.productCategory.upsert({
        where: {
          productId_categoryId: {
            productId: pc.productId,
            categoryId: pc.categoryId,
          },
        },
        update: pc,
        create: pc,
      });
    });

    const response = await Promise.all(promise);

    return response;
  }
}
