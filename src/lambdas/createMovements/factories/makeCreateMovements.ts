import {CreateMovementsRepository as CreateMovementsRepository} from '../../../common/repositories/movement/createMovementRepository';
import {CreateMovementsUseCase} from '../domain/createMovementsUseCase';
import {CreateMovementsController} from '../ports/controller/createMovementsController';
import {prisma} from '../../../../prisma/prismaClient';
import {ListProductsRepository} from '../../../common/repositories/product/listProductsRepository';
import {UpdateProductRepository} from '../../../common/repositories/product/updateProductRepository';

export function makeCreateMovementsController() {
  const dbClient = prisma;
  const createMovementsRepository = new CreateMovementsRepository(dbClient);
  const listProductsRepository = new ListProductsRepository(dbClient);
  const updateProductRepository = new UpdateProductRepository(dbClient);

  const createNewProductUseCase = new CreateMovementsUseCase(
    createMovementsRepository,
    listProductsRepository,
    updateProductRepository,
  );

  const createMovementsController = new CreateMovementsController(
    createNewProductUseCase,
  );

  return createMovementsController;
}
