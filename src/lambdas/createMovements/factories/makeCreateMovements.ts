import {CreateMovementsRepository as CreateMovementsRepository} from '../../../common/repositories/movement/createMovementRepository';
import {CreateMovementsUseCase} from '../domain/createMovementsUseCase';
import {CreateMovementsController} from '../ports/controller/createMovementsController';
import {prisma} from '../../../../prisma/prismaClient';
import {ListProductsRepository} from '../../../common/repositories/product/listProductsRepository';

export function makeCreateMovementsController() {
  const dbClient = prisma;
  const createMovementsRepository = new CreateMovementsRepository(dbClient);
  const listProductsRepository = new ListProductsRepository(dbClient);

  const createNewProductUseCase = new CreateMovementsUseCase(
    createMovementsRepository,
    listProductsRepository,
  );

  const createMovementsController = new CreateMovementsController(
    createNewProductUseCase,
  );

  return createMovementsController;
}
