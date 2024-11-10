import {DeleteProductController} from '../ports/controllers/deleteProductController';
import {DeleteProductUseCase} from '../domain/deleteProductUseCase';
import {prisma} from '../../../../../prisma/prismaClient';
import {DeleteProductRepository} from '../../../../common/repositories/product/deleteProductRepository';
import {DeleteMovementRepository} from '../../../../common/repositories/movement/deleteMovementRepository';
import {ListMovementsRepository} from '../../../../common/repositories/movement/listMovementsRepository';
import {DeleteProductSupplierRepository} from '../../../../common/repositories/productSupplier/deleteProductSupplierRepository';

export function MakeDeleteProductController() {
  const deleteProductRepository = new DeleteProductRepository(prisma);
  const deleteProductSupplierRepository = new DeleteProductSupplierRepository(
    prisma,
  );
  const deleteProductUseCase = new DeleteProductUseCase(
    deleteProductRepository,
    deleteProductSupplierRepository,
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
