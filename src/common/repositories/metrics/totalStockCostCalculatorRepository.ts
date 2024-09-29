import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';

export class TotalStockCostCalculatorRepository
  implements Repository<{userId: string}, number>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec({userId}: {userId: string}) {
    try {
      const [{result: totalStockCost}] = await this.dbClient.$queryRawUnsafe<
        {
          result: number;
        }[]
      >(`
				select 
					sum(p."stockQuantity" * p."unitPrice") as "result"
				from "Product" p 
				where 
				p."userId" = '${userId}'
			`);

      console.log('totalStockCost', totalStockCost);

      return Number(totalStockCost);
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
