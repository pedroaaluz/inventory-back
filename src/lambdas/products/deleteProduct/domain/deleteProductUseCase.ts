import {UseCase} from '../../../../common/interfaces';
import {DeleteProductRepository} from '../../../../common/repositories/product/deleteProductRepository';
import {DeleteProductSupplierRepository} from '../../../../common/repositories/productSupplier/deleteProductSupplierRepository';

export class DeleteProductUseCase implements UseCase<string, void> {
  constructor(
    private readonly deleteProductRepository: DeleteProductRepository,
    private readonly deleteProductSupplierRepository: DeleteProductSupplierRepository,
  ) {}

  async exec(productId: string) {
    const productDTO = {
      productId,
    };

    console.log('Product', productDTO);

    await this.deleteProductRepository.exec(productDTO.productId);

    await this.deleteProductSupplierRepository.exec({
      productId,
    });
  }
}
