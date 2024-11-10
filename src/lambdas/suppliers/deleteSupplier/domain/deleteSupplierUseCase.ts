import {UseCase} from '../../../../common/interfaces';
import {DeleteProductSupplierRepository} from '../../../../common/repositories/productSupplier/deleteProductSupplierRepository';
import {DeleteSupplierRepository} from '../../../../common/repositories/suppliers/deleteSupplierRepository';

export class DeleteSupplierUseCase implements UseCase<string, void> {
  constructor(
    private readonly deleteSupplierRepository: DeleteSupplierRepository,
    private readonly deleteProductSupplierRepository: DeleteProductSupplierRepository,
  ) {}

  async exec(supplierID: string) {
    const supplierDTO = {
      supplierId: supplierID,
    };

    console.log('supplierDTO', supplierDTO);

    await this.deleteSupplierRepository.exec(supplierDTO.supplierId);

    await this.deleteProductSupplierRepository.exec({
      suppliersIds: [supplierID],
    });
  }
}
