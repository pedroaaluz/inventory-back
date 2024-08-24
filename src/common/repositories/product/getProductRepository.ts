import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';
import {Product} from '@prisma/client';

export class GetProductRepository
  implements Repository<string, { product: Product, supplierId: string[], category: string[]}  | null>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(productDTO: string): Promise<{ product: Product, supplierId: string[], category: string[]} | null> {
    const product = await this.dbClient.product.findUnique({
      where: {id: productDTO},
      include: {
        category: true,
        productSupplier: true,
      },

    });
    
    if (!product) {
      return null
    }

    return {
      product: product,
      supplierId: product.productSupplier.map(supplier => supplier.supplierId) || null,
      category: product.category.map(category => category.categoryId) || [],
    }
  }
}
