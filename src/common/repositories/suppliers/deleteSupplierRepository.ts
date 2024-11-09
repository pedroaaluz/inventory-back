import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';
import {Supplier} from '@prisma/client';

export class DeleteSupplierRepository
  implements Repository<string, Supplier | null>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(supplierId: string): Promise<Supplier | null> {
    console.log('supplierId', supplierId);

    const supplier = await this.dbClient.supplier.update({
      where: {id: supplierId},
      data: {
        deletedAt: new Date(),
      },
    });

    return supplier;
  }
}
