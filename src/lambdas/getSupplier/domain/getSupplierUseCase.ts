import {UseCase} from '../../../common/interfaces';
import {GetSupplierRepository} from '../../../common/repositories/suppliers/getSupplierRepository';
import type {Supplier} from '@prisma/client';

export class GetSupplierUseCase
  implements UseCase<string, {supplier: Supplier} | null>
{
  constructor(private readonly getSupplierRepository: GetSupplierRepository) {}

  async exec(input: string) {
    const supplierDTO = {
      supplierId: input,
    };

    console.log('supplier', supplierDTO);

    const supplier = await this.getSupplierRepository.exec(
      supplierDTO.supplierId,
    );

    if (supplier == null) {
      return null;
    }

    return supplier;
  }
}
