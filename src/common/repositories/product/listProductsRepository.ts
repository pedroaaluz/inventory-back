import type {PrismaClient, Prisma} from '@prisma/client';
import {Repository} from '../../interfaces';
import type {
  IListProductsOutput,
  TListProductsInput,
} from '../../types/product';

export class ListProductsRepository
  implements Repository<TListProductsInput, IListProductsOutput>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(filterInput: TListProductsInput) {
    try {
      const {
        categoriesIds,
        suppliersIds,
        startDate,
        endDate,
        orderBy,
        skip,
        userId,
        pageSize,
        name,
        productsIds,
      } = filterInput;

      const where: Prisma.ProductWhereInput[] = [
        {
          createdAt: {gte: new Date(`${startDate}T00:00:00.000Z`)},
        },
        {
          createdAt: {lte: new Date(`${endDate}T23:59:59.999Z`)},
        },
        {userId},
      ];

      if (categoriesIds && categoriesIds.length > 0) {
        where.push({
          productCategory: {some: {categoryId: {in: categoriesIds}}},
        });
      }

      if (productsIds && productsIds?.length > 0) {
        where.push({
          id: {in: productsIds},
        });
      }

      if (suppliersIds && suppliersIds.length > 0) {
        where.push({
          productSupplier: {some: {supplierId: {in: suppliersIds}}},
        });
      }

      if (name) {
        where.push({
          nameNormalized: {
            contains: name,
          },
        });
      }

      console.log('Where clauses', where);

      const [products, count] = await Promise.all([
        this.dbClient.product.findMany({
          skip,
          orderBy: {name: (orderBy as Prisma.SortOrder) || 'asc'},
          take: pageSize,
          where: {
            AND: where,
          },
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
        }),

        this.dbClient.product.count({
          where: {AND: where},
        }),
      ]);

      console.log('query finished');

      return {
        products: products.map(
          ({productCategory, productSupplier, ...restProduct}) => ({
            ...restProduct,
            suppliers: productSupplier.map(ps => ps.supplier),
            categories: productCategory.map(pc => pc.category),
          }),
        ),
        count,
        totalPages: Math.ceil(count / (pageSize || count)),
      };
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
