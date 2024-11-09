import {DeleteProductController} from '../ports/controllers/deleteProductController';
import {DeleteProductUseCase} from '../domain/deleteProductUseCase';
import {prisma} from '../../../../../prisma/prismaClient';
import {DeleteProductRepository} from '../../../../common/repositories/product/deleteProductRepository';

export function MakeDeleteProductController() {
  const deleteProductRepository = new DeleteProductRepository(prisma);
  const deleteProductUseCase = new DeleteProductUseCase(
    deleteProductRepository,
  );
  const getProductController = new DeleteProductController(
    deleteProductUseCase,
  );

  return getProductController;
}
