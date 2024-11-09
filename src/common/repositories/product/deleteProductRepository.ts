import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';
import {Product} from '@prisma/client';

export class DeleteProductRepository
  implements Repository<string, Product | null>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(productId: string): Promise<Product | null> {
    console.log('productId', productId);

    const product = await this.dbClient.product.update({
      where: {id: productId},
      data: {
        deletedAt: new Date(),
      },
    });

    return product;
  }
}
