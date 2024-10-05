import {prisma} from '../../../../../prisma/prismaClient';
import {GetProductsNearIdealStockRepository} from '../../../../common/repositories/metrics/getProductsNearIdealStockRepository';
import {GetProductsNearIdealStockUseCase} from '../domain/getProductsNearIdealStockUseCase';
import {GetProductsNearIdealStockController} from '../ports/controller/getProductsNearIdealStockController';

export function makeGetProductsNearIdealStock() {
  const dbClient = prisma;

  const getProductsNearIdealStockRepository =
    new GetProductsNearIdealStockRepository(dbClient);

  const getProductsNearIdealStockUseCase = new GetProductsNearIdealStockUseCase(
    getProductsNearIdealStockRepository,
  );

  const getProductsNearIdealStockController =
    new GetProductsNearIdealStockController(getProductsNearIdealStockUseCase);

  return getProductsNearIdealStockController;
}
