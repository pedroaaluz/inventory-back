import {prisma} from '../../../../../prisma/prismaClient';
import {DeleteMovementRepository} from '../../../../common/repositories/movement/deleteMovementRepository';
import {GetProductRepository} from '../../../../common/repositories/product/getProductRepository';
import {UpdateProductRepository} from '../../../../common/repositories/product/updateProductRepository';
import {DeleteMovementsUseCase} from '../domain/deleteMovementsUseCase';
import {DeleteMovementController} from '../ports/controllers/deleteMovementController';

export const MakeDeleteMovementController = () => {
  const updateProductRepository = new UpdateProductRepository(prisma);
  const deleteMovementRepository = new DeleteMovementRepository(prisma);
  const getProductRepository = new GetProductRepository(prisma);

  const deleteMovementUseCase = new DeleteMovementsUseCase(
    deleteMovementRepository,
    updateProductRepository,
    getProductRepository,
  );

  const deleteMovementController = new DeleteMovementController(
    deleteMovementUseCase,
  );

  return deleteMovementController;
};
