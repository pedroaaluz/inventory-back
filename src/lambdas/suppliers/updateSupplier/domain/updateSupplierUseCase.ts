import {UseCase} from '../../../../common/interfaces';
import {UpdateSupplierRepository} from '../../../../common/repositories/suppliers/updateSupplierRepository';
import {IUpdateSupplierInput} from '../../../../common/types/supplier';
import {GetSupplierRepository} from '../../../../common/repositories/suppliers/getSupplierRepository';
import {NotFound} from 'http-errors';
import {normalizeName} from '../../../../common/string/normalize';
import {Supplier} from '@prisma/client';
import {SupplierImageStorage} from '../../../../common/infrastructure/supplierImageStorage';
import {get} from 'http';

export class UpdateSupplierUseCase
  implements UseCase<IUpdateSupplierInput, Supplier>
{
  constructor(
    private readonly updateSupplierRepository: UpdateSupplierRepository,
    private readonly getSupplierRepository: GetSupplierRepository,
    private readonly supplierImageStorageAdapter: SupplierImageStorage,
  ) {}

  async exec(input: IUpdateSupplierInput) {
    const supplierDTO: IUpdateSupplierInput = {
      id: input.id,
      userId: input.userId,
      name: input.name,
      image: input.image
        ? await this.supplierImageStorageAdapter.uploadFile(
            input.image,
            `${input.userId}/${input.id}.jpg`,
          )
        : undefined,
      nameNormalized: input.name ? normalizeName(input.name) : undefined,
      cnpj: input.cnpj,
      email: input.email,
      phone: input.phone,
      address: input.address,
    };

    console.log('SupplierDTO', supplierDTO);

    const getSupplierResult = await this.getSupplierRepository.exec(
      supplierDTO.id,
    );

    if (!getSupplierResult) {
      throw new NotFound('Supplier not found');
    }

    if (getSupplierResult.supplier.userId !== supplierDTO.userId) {
      throw new NotFound('Supplier not found');
    }

    if (getSupplierResult.supplier.deletedAt) {
      throw new NotFound('Supplier not found');
    }

    const [supplierUpdated] = await this.updateSupplierRepository.exec(
      supplierDTO,
    );

    console.log('Updated Supplier');

    return supplierUpdated;
  }
}
