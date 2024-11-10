import {UseCase} from '../../../../common/interfaces';
import {DeleteSupplierRepository} from '../../../../common/repositories/suppliers/deleteSupplierRepository';

export class DeleteSupplierUseCase implements UseCase<string, void> {
  constructor(
    private readonly deleteSupplierRepository: DeleteSupplierRepository,
  ) {}

  async exec(supplierID: string) {
    const supplierDTO = {
      supplierId: supplierID,
    };

    console.log('supplierDTO', supplierDTO);

    await this.deleteSupplierRepository.exec(supplierDTO.supplierId);
  }
}
