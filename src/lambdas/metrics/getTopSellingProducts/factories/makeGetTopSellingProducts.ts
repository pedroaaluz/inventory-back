import {prisma} from '../../../../../prisma/prismaClient';
import {GetTopSellingProductsRepository} from '../../../../common/repositories/metrics/getTopSellingProductsRepository';
import {GetTopSellingProductsUseCase} from '../domain/getTopSellingProductsUseCase';
import {GetTopSellingProductsController} from '../ports/controller/getTopSellingProductsController';

export function makeGetTopSellingProducts() {
  const dbClient = prisma;

  const getTopSellingProductsRepository = new GetTopSellingProductsRepository(
    dbClient,
  );

  const getTopSellingProductsUseCase = new GetTopSellingProductsUseCase(
    getTopSellingProductsRepository,
  );

  const getTopSellingProductsController = new GetTopSellingProductsController(
    getTopSellingProductsUseCase,
  );

  return getTopSellingProductsController;
}
