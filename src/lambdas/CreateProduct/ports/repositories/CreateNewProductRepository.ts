import type {PrismaClient, Product} from '@prisma/client';
import {Repository} from '../../../../common/interfaces';
import {TCreateProductInput} from '../../../../common/types/product';

export class CreateNewProductRepository
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

      await tx.productSupplier.create({
        data: {
          supplierId: productDTO.supplierId,
          productId: product.id,
        },
      });

      await tx.movement.create({
        data: {
          movementType: 'ADD_TO_STOCK',
          quantity: productDTO.stockQuantity,
          productId: product.id,
          userId: productDTO.userId,
          productName: product.name,
        },
      });

      return product;
    });

    return createdProduct;
  }
  catch(error) {
    console.log('Error', error);
    throw new Error(error.message);
  }
}
