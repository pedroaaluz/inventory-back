import {PrismaClient, Supplier} from '@prisma/client';
import {Repository} from '../../../../common/interfaces';
import {CreateSupplierInput} from '../../../../common/types/supplier';

export class CreateSupplierRepository
  implements Repository<CreateSupplierInput, Supplier>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(SupplierDTO: CreateSupplierInput) {
    const supplier = await this.dbClient.supplier.create({
      data: {
        name: SupplierDTO.name,
        address: SupplierDTO.address,
        phone: SupplierDTO.phone,
        email: SupplierDTO.email,
        nameNormalized: SupplierDTO.name,
        userId: SupplierDTO.userId,
        cnpj: SupplierDTO.cnpj,
      },
    });

    return supplier;
  }
}
