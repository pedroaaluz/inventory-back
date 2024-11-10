import {UseCase} from '../../../../common/interfaces';
import {DeleteMovementRepository} from '../../../../common/repositories/movement/deleteMovementRepository';
import {ListMovementsRepository} from '../../../../common/repositories/movement/listMovementsRepository';
import {DeleteProductRepository} from '../../../../common/repositories/product/deleteProductRepository';
import {DeleteProductSupplierRepository} from '../../../../common/repositories/productSupplier/deleteProductSupplierRepository';

export class DeleteProductUseCase implements UseCase<string, void> {
  constructor(
    private readonly deleteProductRepository: DeleteProductRepository,
    private readonly deleteProductSupplierRepository: DeleteProductSupplierRepository,
    private readonly listMovementsRepository: ListMovementsRepository,
    private readonly deleteMovementRepository: DeleteMovementRepository,
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

    const {movements} = await this.listMovementsRepository.exec({
      productsIds: [productId],
    });

    await Promise.all(
      (movements || []).map(movement =>
        this.deleteMovementRepository.exec(movement.id),
      ),
    );
  }
}
