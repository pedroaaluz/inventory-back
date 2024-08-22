import type {PrismaClient, Product} from '@prisma/client';
import {Repository} from '../../interfaces';
import {TCreateProductInput} from '../../types/product';

export class CreateProductRepository
  implements Repository<TCreateProductInput, Product>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(productDTO: TCreateProductInput) {
    const createdProduct = await this.dbClient.$transaction(async tx => {
      const product = await tx.product.create({
        data: {
          userId: productDTO.userId,
          name: productDTO.name,
          unitPrice: productDTO.unitPrice,
          description: productDTO.description,
          expirationDate: productDTO.expirationDate,
          stockQuantity: productDTO.stockQuantity,
          image: productDTO.image,
        },
      });

      await tx.productCategory.create({
        data: {
          categoryId: productDTO.categoryId,
          productId: product.id,
        },
      });

      return product;
    });

    return createdProduct;
  }
  catch(error: unknown) {
    console.log('Error', error);
    throw error;
  }
}
