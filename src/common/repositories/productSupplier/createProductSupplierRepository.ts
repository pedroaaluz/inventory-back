import type {PrismaClient, ProductSupplier} from '@prisma/client';
import {Repository} from '../../interfaces';
import {TCreateProductSupplierInput} from '../../types/productSupplier';

export class CreateProductSupplierRepository
  implements Repository<TCreateProductSupplierInput, ProductSupplier>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(productSupplierDTO: TCreateProductSupplierInput) {
    const productSupplier = await this.dbClient.$transaction(async tx => {
      return tx.productSupplier.create({data: productSupplierDTO});
    });

    return productSupplier;
  }
}
