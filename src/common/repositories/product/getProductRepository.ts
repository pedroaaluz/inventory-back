import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';
import { requestSchema, responseSchema } from '../../../lambdas/GetProduct/schema';
import {Product} from '@prisma/client';
import {z} from 'zod';

export class GetProductRepository
  implements Repository<z.infer<typeof requestSchema.shape.body>, { product: Product, supplierId: string[], category: string[]}  | null>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(productDTO: z.infer<typeof requestSchema.shape.body>): Promise<{ product: Product, supplierId: string[], category: string[]} | null> {
    const product = await this.dbClient.product.findUnique({
      where: {id: productDTO.id},
      include: {
        category: true,
        productSupplier: true,
      },

    });
    
    //need to return the product, category and supplier
    if (!product) {
      return null
    }

    return {
      product: product,
      supplierId: product.productSupplier.map(supplier => supplier.supplierId),
      category: product.category.map(category => category.categoryId),
    }
  }
}
