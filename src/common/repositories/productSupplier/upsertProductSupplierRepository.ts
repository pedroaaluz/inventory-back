import type {PrismaClient, ProductSupplier} from '@prisma/client';
import {Repository} from '../../interfaces';
import {TUpsertProductSupplierInput} from '../../types/productSupplier';

export class UpsertProductSupplierRepository
  implements Repository<TUpsertProductSupplierInput, ProductSupplier[]>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(
    productSupplierDTO:
      | TUpsertProductSupplierInput
      | TUpsertProductSupplierInput[],
  ) {
    const productSupplierToUpdate = Array.isArray(productSupplierDTO)
      ? productSupplierDTO
      : [productSupplierDTO];

    const promise = productSupplierToUpdate.map(ps => {
      return this.dbClient.productSupplier.upsert({
        where: {
          productId_supplierId: {
            productId: ps.productId,
            supplierId: ps.supplierId,
          },
        },
        update: ps,
        create: ps,
      });
    });

    const response = await Promise.all(promise);

    return response;
  }
}
