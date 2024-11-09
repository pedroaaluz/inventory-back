import {UseCase} from '../../../../common/interfaces';
import {DeleteProductRepository} from '../../../../common/repositories/product/deleteProductRepository';

export class DeleteProductUseCase implements UseCase<string, void> {
  constructor(
    private readonly deleteProductRepository: DeleteProductRepository,
  ) {}

  async exec(productId: string) {
    const productDTO = {
      productId,
    };

    console.log('Product', productDTO);

    await this.deleteProductRepository.exec(productDTO.productId);
  }
}
