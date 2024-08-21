import {PrismaClient} from '@prisma/client';
import {CreateMovementRepository} from '../../../common/repositories/movement/createMovementRepository';
import {CreateProductRepository} from '../../../common/repositories/product/createProductRepository';
import {CreateProductUseCase} from '../domain/createProductUseCase';
import {CreateProductController} from '../ports/controllers/createProductController';
import {CreateProductSupplierRepository} from '../../../common/repositories/productSupplier/createProductSupplierRepository';
import {CreateProductCategoryRepository} from '../../../common/repositories/productCategory/createProductCategoryRepository';

export function makeCreateNewProductController() {
  const dbClient = new PrismaClient();

  const createProductRepository = new CreateProductRepository(dbClient);
  const createMovementRepository = new CreateMovementRepository(dbClient);
  const createProductSupplier = new CreateProductSupplierRepository(dbClient);
  const createProductCategory = new CreateProductCategoryRepository(dbClient);

  const createNewProductUseCase = new CreateProductUseCase(
    createProductRepository,
    createMovementRepository,
    createProductSupplier,
    createProductCategory,
  );

  const createNewProductController = new CreateProductController(
    createNewProductUseCase,
  );
  return createNewProductController;
}
