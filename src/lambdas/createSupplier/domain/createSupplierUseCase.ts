import {Supplier} from '@prisma/client';
import {UseCase} from '../../../common/interfaces';
import {CreateSupplierInput} from '../../../common/types/supplier';
import {CreateSupplierRepository} from '../ports/repositories/createSupplierRepository';
import {SupplierImageStorage} from '../../../common/infrastructure/supplierImageStorage';
import {normalizeName} from '../../../common/string/normalize';
import {requestSchema} from '../schema';
import {z} from 'zod';

export class CreateSupplierUseCase
  implements UseCase<z.infer<typeof requestSchema.shape.body>, Supplier>
{
  constructor(
    private readonly createSupplierRepository: CreateSupplierRepository,
    private readonly supplierImageStorageAdapter: SupplierImageStorage,
  ) {}

  async exec(input: z.infer<typeof requestSchema.shape.body>) {
    const supplierDTO = {
      name: input.name,
      userId: input.userId,
      cnpj: input.cnpj,
      address: input.address,
      phone: input.phone,
      email: input.email,
      image: input.image
        ? await this.supplierImageStorageAdapter.uploadFile(
            input.image,
            `${input.userId}/${input.name}.jpg`,
          )
        : null,
      normalizeName: normalizeName(input.name),
    };

    console.log('supplierDTO', supplierDTO);

    const supplier = await this.createSupplierRepository.exec(supplierDTO);

    console.log('Supplier', supplier);

    return supplier;
  }
}
