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
        id: string;
        name: string;
        image: string | null;
        stockQuantity: number;
        minimumIdealStock: number;
      }[]
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
      const productsNearIdealStock = await this.dbClient.$queryRawUnsafe<
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
			`);

      return productsNearIdealStock;
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
