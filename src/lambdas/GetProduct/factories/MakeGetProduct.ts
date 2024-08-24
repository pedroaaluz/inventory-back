import {GetProductController} from '../ports/controllers/getProductController';
import {GetProductRepository} from '../../../common/repositories/product/getProductRepository';
import {GetProductUseCase} from '../domain/getProductUseCase';
import {prisma} from '../../../../prisma/prismaClient';

export function MakeGetProductController() {
  const getProductRepository = new GetProductRepository(prisma);
  const getProductUseCase = new GetProductUseCase(getProductRepository);
  const getProductController = new GetProductController(getProductUseCase);

  return getProductController;
}
