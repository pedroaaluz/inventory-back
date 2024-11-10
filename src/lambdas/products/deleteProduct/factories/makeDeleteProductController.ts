import {DeleteProductController} from '../ports/controllers/deleteProductController';
import {DeleteProductUseCase} from '../domain/deleteProductUseCase';
import {prisma} from '../../../../../prisma/prismaClient';
import {DeleteProductRepository} from '../../../../common/repositories/product/deleteProductRepository';
import {DeleteMovementRepository} from '../../../../common/repositories/movement/deleteMovementRepository';
import {ListMovementsRepository} from '../../../../common/repositories/movement/listMovementsRepository';

export function MakeDeleteProductController() {
  const deleteProductRepository = new DeleteProductRepository(prisma);
  const deleteProductUseCase = new DeleteProductUseCase(
    deleteProductRepository,
  );

  const deleteMovementRepository = new DeleteMovementRepository(prisma);
  const listMovementsRepository = new ListMovementsRepository(prisma);

  const getProductController = new DeleteProductController(
    deleteProductUseCase,
    deleteMovementRepository,
    listMovementsRepository,
  );

  return getProductController;
}
