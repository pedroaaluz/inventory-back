import type {PrismaClient, Prisma} from '@prisma/client';
import {Repository} from '../../interfaces';
import type {
  IListMovementsRepositoryInput,
  IListMovementsRepositoryOutput,
} from '../../types/movement';

export class ListMovementsRepository
  implements
    Repository<IListMovementsRepositoryInput, IListMovementsRepositoryOutput>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(filterInput: IListMovementsRepositoryInput) {
    try {
      const {
        startDate,
        endDate,
        skip,
        pageSize,
        orderBy,
        userId,
        productsIds,
        productName,
      } = filterInput;

      const where: Prisma.MovementWhereInput[] = [{userId}];

      if (productsIds) {
        where.push({
          productId: {
            in: productsIds,
          },
        });
      }

      if (productName) {
        where.push({
          productNameNormalized: {
            contains: productName,
          },
        });
      }

      if (startDate) {
        where.push({
          createdAt: {gte: new Date(`${startDate}T00:00:00.000Z`)},
        });
      }

      if (endDate) {
        where.push({
          createdAt: {lte: new Date(`${endDate}T23:59:59.999Z`)},
        });
      }

      const [count, movements] = await Promise.all([
        this.dbClient.movement.count({
          where: {
            AND: where,
          },
        }),
        this.dbClient.movement.findMany({
          where: {
            AND: where,
          },
          orderBy: {
            createdAt: orderBy,
          },
          skip,
          take: pageSize,
          include: {
            product: {
              select: {
                image: true,
              },
            },
          },
        }),
      ]);

      return {
        movements: movements.map(movement => ({
          id: movement.id,
          productId: movement.productId,
          productName: movement.productName,
          productNameNormalized: movement.productNameNormalized,
          userId: movement.userId,
          deletedAt: movement.deletedAt,
          quantity: movement.quantity,
          movementType: movement.movementType,
          movementValue: movement.movementValue,
          paymentMethod: movement.paymentMethod,
          createdAt: movement.createdAt,
          updatedAt: movement.updatedAt,
          productImage: movement.product.image,
        })),
        count,
        totalPages: Math.ceil(count / (pageSize ?? count)),
      };
    } catch (error) {
      console.log('Error', error);

      throw error;
    }
  }
}
