import {PrismaClient} from '@prisma/client';
import {UpdateProductUseCase} from '../domain/updateProductUseCase';
import {UpdateProductRepository} from '../../../../common/repositories/product/updateProductRepository';
import {GetProductRepository} from '../../../../common/repositories/product/getProductRepository';
import {CreateMovementsRepository} from '../../../../common/repositories/movement/createMovementRepository';
import {UpdateProductController} from '../ports/controllers/updateProductController';

export function makeUpdateProductController() {
  const dbClient = new PrismaClient();

  const updateProductRepository = new UpdateProductRepository(dbClient);
  const getProductRepository = new GetProductRepository(dbClient);
  const createNewMovementRepository = new CreateMovementsRepository(dbClient);

  const updateProductUseCase = new UpdateProductUseCase(
    updateProductRepository,
    getProductRepository,
    createNewMovementRepository,
  );

  const updateProductController = new UpdateProductController(
    updateProductUseCase,
  );
  return updateProductController;
}
