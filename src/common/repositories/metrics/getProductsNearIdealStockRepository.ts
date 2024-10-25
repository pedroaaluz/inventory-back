import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';

export class GetProductsNearIdealStockRepository
  implements
    Repository<
      {userId: string},
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

  async exec({userId}: {userId: string}) {
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
        p."stockQuantity" <= (p."minimumIdealStock" + 10) and
				p."userId" = '${userId}'
			`);

      return productsNearIdealStock;
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
