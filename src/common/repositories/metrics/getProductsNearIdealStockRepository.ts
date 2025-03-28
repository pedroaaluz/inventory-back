import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';

export class GetProductsNearIdealStockRepository
  implements
    Repository<
      {
        userId: string;
        productName?: string;
        page?: number;
        pageSize?: number;
      },
      {
        productsNearIdealStock: {
          id: string;
          name: string;
          image: string | null;
          stockQuantity: number;
          minimumIdealStock: number;
        }[];
        totalCount: number;
      }
    >
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec({
    userId,
    productName,
    page = 0,
    pageSize = 10,
  }: {
    userId: string;
    productName?: string;
    page?: number;
    pageSize?: number;
  }) {
    try {
      const [productsNearIdealStock, totalCount] = await Promise.all([
        this.dbClient.$queryRawUnsafe<
          {
            id: string;
            name: string;
            image: string | null;
            stockQuantity: number;
            minimumIdealStock: number;
          }[]
        >(`
          select 
            p.id,
            p."name" ,
            p.image ,
            p."stockQuantity" ,
            p."minimumIdealStock"
          from "Product" p 
          where
          ${
            productName ? ` p."nameNormalized" like '%${productName}%' and` : ''
          }
          p."stockQuantity" <= (p."minimumIdealStock" + 10) and
          p."userId" = '${userId}' and 
          p."deletedAt" is null
          limit ${pageSize}
          offset ${(page - 1) * pageSize}
        `),

        this.dbClient.$queryRawUnsafe<{count: number}[]>(`
          select 
            count(*) as count
          from "Product" p 
          where
          ${
            productName ? ` p."nameNormalized" like '%${productName}%' and` : ''
          }
          p."stockQuantity" <= (p."minimumIdealStock" + 10) and
          p."userId" = '${userId}' and 
          p."deletedAt" is null
        `),
      ]);

      return {
        productsNearIdealStock,
        totalCount: Number(totalCount[0].count),
      };
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
