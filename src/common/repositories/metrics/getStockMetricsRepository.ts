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
          WITH sales_data AS (
              SELECT
                  p."id",
                  SUM(CASE WHEN m."movementType" = 'SALE' THEN m."quantity" ELSE 0 END) AS "totalSales"
              FROM
                  "Product" p
              INNER JOIN
                  "Movement" m ON m."productId" = p.id
              WHERE
                  m."createdAt" BETWEEN '${startDate}' AND '${endDate}'
                  AND p."userId" = '${userId}'  
                  ${
                    productName
                      ? `AND p."nameNormalized" LIKE '%${productName}%' `
                      : ''
                  }
              GROUP BY
                  p."id"
          ),
          average_consumption AS (
              SELECT
                  p."id",
                  COALESCE(
                      s."totalSales" / NULLIF(EXTRACT(DAY FROM ('${endDate}'::timestamp - '${startDate}'::timestamp)), 0),
                      0
                  ) AS "averageConsumption"
              FROM
                  "Product" p
              LEFT JOIN
                  sales_data s ON s."id" = p."id"
          ),
          stock_coverage AS (
              SELECT
                  p."id",
                  CASE
                      WHEN EXTRACT(DAY FROM ('${endDate}'::timestamp - '${startDate}'::timestamp)) = 0 THEN NULL
                      ELSE COALESCE(p."stockQuantity" / NULLIF((
                              s."totalSales" / EXTRACT(DAY FROM ('${endDate}'::timestamp - '${startDate}'::timestamp))
                          ), 0), 0)
                  END AS "stockCoverage"
              FROM
                  "Product" p
              LEFT JOIN
                  sales_data s ON s."id" = p."id"
          ),
          turnover_rate AS (
              SELECT
                  p."id",
                  COALESCE(s."totalSales" / NULLIF(p."stockQuantity", 0), 0) AS "turnoverRate"
              FROM
                  "Product" p
              LEFT JOIN
                  sales_data s ON s."id" = p."id"
          )
          SELECT
              p."id",
              p."name",
              p.image,
              p."minimumIdealStock",
              s."totalSales",
              p."stockQuantity",
              ac."averageConsumption",
              sc."stockCoverage",
              tr."turnoverRate"
          FROM
              "Product" p
          LEFT JOIN
              sales_data s ON p."id" = s."id"
          LEFT JOIN
              average_consumption ac ON p."id" = ac."id"
          LEFT JOIN
              stock_coverage sc ON p."id" = sc."id"
          LEFT JOIN
              turnover_rate tr ON p."id" = tr."id"
          WHERE
              p."userId" = '${userId}' 
              and p."deletedAt" is null
              ${
                productName
                  ? `AND p."nameNormalized" LIKE '%${productName}%' `
                  : ''
              }
          LIMIT ${pageSize}
          OFFSET ${(page - 1) * pageSize}
        `),
        this.dbClient.$queryRawUnsafe<{totalCount: bigint}[]>(`
          SELECT
              COUNT(DISTINCT p.id) AS "totalCount"
          FROM
             "Product" p
          WHERE
               p."userId" = '${userId}' and 
          p."deletedAt" is null
              ${
                productName
                  ? `AND p."nameNormalized" LIKE '%${productName}%' `
                  : ''
              }
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
