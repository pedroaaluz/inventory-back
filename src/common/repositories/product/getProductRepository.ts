import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';
import {Product} from '@prisma/client';

export class GetProductRepository
  implements
    Repository<
      string,
      {product: Product; supplierId: string[]; category: string[]} | null
    >
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(productDTO: string): Promise<{
    product: Product;
    supplierId: string[];
    category: string[];
  } | null> {
    console.log('productDTO', productDTO);

    const product = await this.dbClient.product.findUnique({
      where: {id: productDTO},
      include: {
        productCategory: true,
        productSupplier: true,
      },
    });

    if (!product) {
      return null;
    }

    return {
      product: product,
      supplierId:
        product.productSupplier.map(supplier => supplier.supplierId) || null,
      category:
        product.productCategory.map(category => category.categoryId) || [],
    };
  }
}
