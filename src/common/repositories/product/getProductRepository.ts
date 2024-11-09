import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';
import {Product} from '@prisma/client';

export class GetProductRepository
  implements
    Repository<
      string,
      {
        product: Product;
        suppliers: {
          name: string;
          nameNormalized: string;
          id: string;
        }[];
        categories: {
          name: string;
          id: string;
        }[];
      } | null
    >
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(productDTO: string): Promise<{
    product: Product;
    suppliers: {
      name: string;
      nameNormalized: string;
      id: string;
    }[];
    categories: {
      name: string;
      id: string;
    }[];
  } | null> {
    console.log('productDTO', productDTO);

    const product = await this.dbClient.product.findUnique({
      where: {id: productDTO, deletedAt: null},
      include: {
        productSupplier: {
          select: {
            supplier: {
              select: {
                name: true,
                id: true,
                nameNormalized: true,
              },
            },
          },
        },
        productCategory: {
          select: {
            category: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return {
      product: product,
      suppliers: product.productSupplier.map(ps => ps.supplier),
      categories: product.productCategory.map(pc => pc.category),
    };
  }
}
