import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';

interface StockMetrics {
  id: string;
  name: string;
  image: string | null;
  totalSales: number;
  stockQuantity: number;
  averageConsumption: number;
  stockCoverage: number;
  turnoverRate: number;
  minimumIdealStock: number;
}

export class GetStockMetricsRepository
  implements
    Repository<
      {
        userId: string;
        startDate: string;
        endDate: string;
        productName?: string;
        page?: number;
        pageSize?: number;
      },
      {
        data: StockMetrics[];
        totalCount: number;
      }
    >
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec({
    userId,
    startDate,
    endDate,
    productName,
    page = 1,
    pageSize = 10,
  }: {
    userId: string;
    startDate: string;
    endDate: string;
    productName?: string;
    page?: number;
    pageSize?: number;
  }) {
    try {
      const [stockMetrics, totalCountResult] = await Promise.all([
        this.dbClient.$queryRawUnsafe<StockMetrics[]>(`
          SELECT
            p."id",
            p."name",
            p.image,
            p."minimumIdealStock",
            SUM(m."quantity") as "totalSales", 
            p."stockQuantity",
            SUM(m."quantity") / EXTRACT(DAY FROM ('${endDate}'::timestamp - '${startDate}'::timestamp)) AS "averageConsumption", -- Consumo médio diário
            p."stockQuantity" / (SUM(m."quantity") / EXTRACT(DAY FROM ('${endDate}'::timestamp - '${startDate}'::timestamp))) AS "stockCoverage", -- Cobertura de estoque
            SUM(m."quantity") / p."stockQuantity" AS "turnoverRate" -- Taxa de rotatividade
          FROM
            "Product" p
          INNER JOIN
            "Movement" m ON m."productId" = p.id
          WHERE
            m."createdAt" BETWEEN '${startDate}' AND '${endDate}' 
            AND p."userId" = '${userId}' 
            ${productName ? `AND p."nameNormalized" = '${productName}'` : ''}
          GROUP BY
            p."id", p."name", p."stockQuantity", p."nameNormalized"
          LIMIT ${pageSize}
          OFFSET ${page * pageSize}
        `),

        this.dbClient.$queryRawUnsafe<{totalCount: bigint}[]>(`
          SELECT 
            COUNT(DISTINCT p.id) as "totalCount"
          FROM 
            "Product" p
          INNER JOIN 
            "Movement" m ON m."productId" = p.id
          WHERE 
            m."createdAt" BETWEEN '${startDate}' AND '${endDate}' 
            AND p."userId" = '${userId}'
            ${productName ? `AND p."nameNormalized" = '${productName}'` : ''}
        `),
      ]);

      return {
        data: stockMetrics.map(product => ({
          ...product,
          totalSales: Number(product.totalSales),
          stockQuantity: Number(product.stockQuantity),
          averageConsumption: Number(product.averageConsumption),
          stockCoverage: Number(product.stockCoverage),
          turnoverRate: Number(product.turnoverRate),
          minimumIdealStock: Number(product.minimumIdealStock),
        })),
        totalCount: Number(totalCountResult[0].totalCount),
      };
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
