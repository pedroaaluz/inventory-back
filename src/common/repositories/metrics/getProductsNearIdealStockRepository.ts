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
        supplierPhone?: string | null;
        supplierEmail?: string | null;
        supplierId: string;
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
          supplierPhone: string | null;
          supplierEmail: string | null;
          supplierId: string;
        }[]
      >(`
        select 
          p.id,
          p."name" ,
          p.image ,
          p."stockQuantity" ,
          p."minimumIdealStock",
          s.phone as "supplierPhone" ,
          s.email as"supplierEmail" , 
          ps."supplierId" 
        from "Product" p 
        inner join "ProductSupplier" ps on ps."productId" = p.id 
        inner join "Supplier" s on s.id = ps."supplierId" 
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
