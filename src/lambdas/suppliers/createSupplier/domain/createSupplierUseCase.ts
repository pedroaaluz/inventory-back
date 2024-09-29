import {Supplier} from '@prisma/client';
import {UseCase} from '../../../../common/interfaces';
import {CreateSupplierRepository} from '../ports/repositories/createSupplierRepository';
import {SupplierImageStorage} from '../../../../common/infrastructure/supplierImageStorage';
import {
  normalizeCNPJ,
  normalizeName,
} from '../../../../common/string/normalize';
import {requestSchema} from '../schema';
import {z} from 'zod';
import {randomUUID} from 'crypto';

export class CreateSupplierUseCase
  implements UseCase<z.infer<typeof requestSchema.shape.body>, Supplier>
{
  constructor(
    private readonly createSupplierRepository: CreateSupplierRepository,
    private readonly supplierImageStorageAdapter: SupplierImageStorage,
  ) {}

  async exec(input: z.infer<typeof requestSchema.shape.body>) {
    const supplierId = randomUUID();

    const supplierDTO = {
      id: supplierId,
      name: input.name,
      userId: input.userId,
      cnpj: input.cnpj ? normalizeCNPJ(input.cnpj) : null,
      address: input.address,
      phone: input.phone,
      email: input.email,
      image: input.image
        ? await this.supplierImageStorageAdapter.uploadFile(
            input.image,
            `${input.userId}/${supplierId}.jpg`,
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
