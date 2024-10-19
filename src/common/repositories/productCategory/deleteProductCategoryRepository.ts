import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';
import {IDeleteProductCategoryRepository} from '../../types/productCategory';

export class DeleteProductCategoryRepository
  implements Repository<IDeleteProductCategoryRepository, number>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(productCategoryDTO: IDeleteProductCategoryRepository) {
    const rowDeleted = await this.dbClient.productCategory.deleteMany({
      where: {
        productId: productCategoryDTO.productId,
        categoryId: {
          in: productCategoryDTO.categoriesIds,
        },
      },
    });

    return rowDeleted.count;
  }
}
