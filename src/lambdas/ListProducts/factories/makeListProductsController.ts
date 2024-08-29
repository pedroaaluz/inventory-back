import {prisma} from '../../../../prisma/prismaClient';
import {ListProductsRepository} from '../../../common/repositories/product/listProductsRepository';
import {ListProductsUseCase} from '../domain/listProductsUseCase';
import {ListProductsController} from '../ports/controllers/listProductsController';

export function makeListProductsController() {
  const listProductRepository = new ListProductsRepository(prisma);
  const listProductsUseCase = new ListProductsUseCase(listProductRepository);
  const listProductsController = new ListProductsController(
    listProductsUseCase,
  );
  return listProductsController;
}
