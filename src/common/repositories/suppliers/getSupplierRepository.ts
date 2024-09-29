import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';
import {Supplier} from '@prisma/client';

export class GetSupplierRepository
  implements Repository<string, {supplier: Supplier} | null>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(productDTO: string): Promise<{
    supplier: Supplier;
  } | null> {
    console.log('supplierDTO', productDTO);

    const supplier = await this.dbClient.supplier.findUnique({
      where: {id: productDTO},
    });

    if (!supplier) {
      return null;
    }

    return {
      supplier,
    };
  }
}
