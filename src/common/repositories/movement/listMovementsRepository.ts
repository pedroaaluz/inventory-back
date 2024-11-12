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
        movementType,
        paymentMethod,
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
          product: {
            nameNormalized: {
              contains: productName,
            },
          },
        });
      }

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

      if (movementType) {
        where.push({
          movementType,
        });
      }

      if (paymentMethod) {
        where.push({
          paymentMethod,
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
            createdAt: orderBy || 'desc',
          },
          skip,
          take: pageSize,
          include: {
            product: {
              select: {
                image: true,
                name: true,
                nameNormalized: true,
              },
            },
          },
        }),
      ]);

      return {
        movements: movements.map(movement => ({
          id: movement.id,
          productId: movement.productId,
          productName: movement.product.name,
          productNameNormalized: movement.product.nameNormalized,
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
