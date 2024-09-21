import type {PrismaClient, ProductCategory} from '@prisma/client';
import {Repository} from '../../interfaces';
import {TCreateProductCategoryInput} from '../../types/productCategory';

export class CreateProductCategoryRepository
  implements Repository<TCreateProductCategoryInput, ProductCategory>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(productCategoryDTO: TCreateProductCategoryInput) {
    const productCategory = await this.dbClient.$transaction(async tx => {
      return tx.productCategory.create({data: productCategoryDTO});
    });

    return productCategory;
  }
}
