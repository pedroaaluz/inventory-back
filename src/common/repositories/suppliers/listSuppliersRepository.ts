import type {PrismaClient, Prisma, Supplier} from '@prisma/client';
import {Repository} from '../../interfaces';
import type {
  TListSuppliersInput,
  IListSuppliersOutput,
} from '../../types/supplier';

export class ListSuppliersRepository
  implements Repository<TListSuppliersInput, IListSuppliersOutput>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(filterInput: TListSuppliersInput) {
    try {
      const {
        suppliersIds,
        startDate,
        endDate,
        orderBy,
        skip,
        userId,
        pageSize,
        name,
      } = filterInput;

      const where: Prisma.SupplierWhereInput[] = [{userId}];

      if (startDate) {
        where.push({
          createdAt: {gte: startDate},
        });
      }

      if (endDate) {
        where.push({
          createdAt: {lte: endDate},
        });
      }

      if (suppliersIds && suppliersIds.length > 0) {
        where.push({
          id: {in: suppliersIds},
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

      const [suppliers, count] = await Promise.all([
        this.dbClient.supplier.findMany({
          skip,
          orderBy: {name: (orderBy as Prisma.SortOrder) || 'asc'},
          take: pageSize,
          where: {
            AND: where,
          },
        }),

        this.dbClient.supplier.count({
          where: {AND: where},
        }),
      ]);

      console.log('query finished');

      return {
        suppliers,
        count,
        totalPages: Math.ceil(count / (pageSize || count)),
      };
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
