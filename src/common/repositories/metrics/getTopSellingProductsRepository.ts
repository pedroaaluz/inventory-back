import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';

export class GetTopSellingProductsRepository
  implements
    Repository<
      {userId: string; startDate: string; endDate: string},
      {
        count: number;
        productId: string;
        productName: string;
        productImage: string | null;
        stockQuantity: number;
      }[]
    >
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec({
    userId,
    startDate,
    endDate,
  }: {
    userId: string;
    startDate: string;
    endDate: string;
  }) {
    try {
      console.log('get topSellingProducts');

      const topSellingProducts = await this.dbClient.$queryRawUnsafe<
        {
          count: number;
          productId: string;
          productName: string;
          productImage: string | null;
          stockQuantity: number;
        }[]
      >(`
        SELECT 
          count(m.*),
          p."name",
          p."nameNormalized",
          p."stockQuantity",
          m."productId"
        FROM "Product" p 
        INNER JOIN "Movement" m ON m."productId" = p.id 
        WHERE 
				p."userId" = '${userId}'
        AND m."createdAt" >= '${startDate}'
        AND m."createdAt" <= '${endDate}'
        GROUP BY p."name", p."nameNormalized", p."stockQuantity", m."productId"
      `);

      return topSellingProducts.map(product => ({
        ...product,
        count: Number(product.count),
      }));
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
