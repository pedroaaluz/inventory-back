import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';
import {TDeleteProductSupplierRepository} from '../../types/productSupplier';

export class DeleteProductSupplierRepository
  implements Repository<TDeleteProductSupplierRepository, number>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(productSupplierDTO: TDeleteProductSupplierRepository) {
    const rowDeleted = await this.dbClient.productSupplier.deleteMany({
      where: {
        ...('productId' in productSupplierDTO && {
          productId: productSupplierDTO?.productId,
        }),
        ...('suppliersIds' in productSupplierDTO && {
          supplierId: {
            in: productSupplierDTO?.suppliersIds,
          },
        }),
      },
    });

    return rowDeleted.count;
  }
}
