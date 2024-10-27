import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';

export class GetTopSellingProductsRepository
  implements
    Repository<
      {
        userId: string;
        startDate: string;
        endDate: string;
        page: number;
        pageSize: number;
      },
      {
        data: {
          count: number;
          productId: string;
          productName: string;
          productImage: string | null;
          stockQuantity: number;
        }[];
        totalCount: number;
      }
    >
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec({
    userId,
    startDate,
    endDate,
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
    userId: string;
    startDate: string;
    endDate: string;
  }) {
    try {
      console.log('get topSellingProducts');

      const [topSellingProducts, totalCountResult] = await Promise.all([
        this.dbClient.$queryRawUnsafe<
          {
            count: bigint;
            productId: string;
            productName: string;
            productImage: string | null;
            stockQuantity: number;
          }[]
        >(`
          SELECT 
            count(m.*) as count,
            p.id as "productId",
            p."name" as "productName",
            p.image as "productImage",
            p."stockQuantity"
          FROM "Product" p 
          INNER JOIN "Movement" m ON m."productId" = p.id 
          WHERE 
            p."userId" = '${userId}'
            AND m."createdAt" >= '${startDate}'
            AND m."createdAt" <= '${endDate}'
          GROUP BY p.id, p."name", p.image, p."stockQuantity"
          LIMIT ${pageSize}
          OFFSET ${page * pageSize}
        `),

        this.dbClient.$queryRawUnsafe<{totalCount: bigint}[]>(`
          SELECT 
            count(distinct m."productId") as "totalCount"
          FROM "Product" p 
          INNER JOIN "Movement" m ON m."productId" = p.id 
          WHERE 
            p."userId" = '${userId}'
            AND m."createdAt" >= '${startDate}'
            AND m."createdAt" <= '${endDate}'
        `),
      ]);

      return {
        data: topSellingProducts.map(product => ({
          ...product,
          count: Number(product.count),
        })),
        totalCount: Number(totalCountResult[0].totalCount),
      };
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
