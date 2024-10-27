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
          ${productName ? ` p."name" like '%${productName}%' and` : ''}
          p."stockQuantity" <= (p."minimumIdealStock" + 10) and
          p."userId" = '${userId}'
          limit ${pageSize}
          offset ${page * pageSize}
        `),

        this.dbClient.$queryRawUnsafe<{count: number}[]>(`
          select 
            count(*) as count
          from "Product" p 
          where
          ${productName ? ` p."name" like '%${productName}%' and` : ''}
          p."stockQuantity" <= (p."minimumIdealStock" + 10) and
          p."userId" = '${userId}'
        `),
      ]);

      return {
        productsNearIdealStock,
        totalCount: totalCount[0].count,
      };
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
