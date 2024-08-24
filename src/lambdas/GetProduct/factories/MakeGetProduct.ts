import {PrismaClient} from '@prisma/client';
import {GetProductUseCase} from '../domain/getProductUseCase';
import {GetProductController} from '../ports/controllers/getProductController';
import {GetProductRepository} from '../../../common/repositories/product/getProductRepository';

export function MakeGetProductController() {
  const dbClient = new PrismaClient();

  const getProductRepository = new GetProductRepository(dbClient);
  const getProductUseCase = new GetProductUseCase(getProductRepository);
  const getProductController = new GetProductController(getProductUseCase);

  return getProductController;
}
