import type {PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';
import {IDeleteProductSupplierRepository} from '../../types/productSupplier';

export class DeleteProductSupplierRepository
  implements Repository<IDeleteProductSupplierRepository, number>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(productSupplierDTO: IDeleteProductSupplierRepository) {
    const rowDeleted = await this.dbClient.productSupplier.deleteMany({
      where: {
        productId: productSupplierDTO.productId,
        supplierId: {
          in: productSupplierDTO.suppliersIds,
        },
      },
    });

    return rowDeleted.count;
  }
}
