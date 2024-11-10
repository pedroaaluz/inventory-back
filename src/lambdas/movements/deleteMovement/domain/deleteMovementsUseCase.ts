import {UseCase} from '../../../../common/interfaces';
import {DeleteMovementRepository} from '../../../../common/repositories/movement/deleteMovementRepository';
import {GetProductRepository} from '../../../../common/repositories/product/getProductRepository';
import {UpdateProductRepository} from '../../../../common/repositories/product/updateProductRepository';
export class DeleteMovementsUseCase implements UseCase<string, void> {
  constructor(
    private readonly deleteMovementRepository: DeleteMovementRepository,
    private readonly updateProductRepository: UpdateProductRepository,
    private readonly getProductRepository: GetProductRepository,
  ) {}

  async exec(movementId: string): Promise<void> {
    const movement = await this.deleteMovementRepository.exec(movementId);
    const {product} =
      (await this.getProductRepository.exec(movement.productId)) || {};

    if (!product) {
      return;
    }

    let newQuantity = 0;

    switch (movement.movementType) {
      case 'SALE':
      case 'REMOVE_FROM_STOCK':
        newQuantity = product.stockQuantity + movement.quantity;
        break;
      case 'ADD_TO_STOCK':
        newQuantity = product.stockQuantity - movement.quantity;
        break;
    }

    await this.updateProductRepository.exec({
      id: movement.productId,
      stockQuantity: newQuantity,
      userId: product.userId,
    });
  }
}
