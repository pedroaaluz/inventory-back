import {CreateMovementsRepository} from '../../../common/repositories/movement/createMovementRepository';
import {CreateProductRepository} from '../../../common/repositories/product/createProductRepository';
import {CreateProductUseCase} from '../domain/createProductUseCase';
import {CreateProductController} from '../ports/controllers/createProductController';
import {CreateProductSupplierRepository} from '../../../common/repositories/productSupplier/createProductSupplierRepository';
import {CreateProductCategoryRepository} from '../../../common/repositories/productCategory/createProductCategoryRepository';
import {prisma} from '../../../../prisma/prismaClient';
import {ProductImageStorage} from '../../../common/infrastructure/productImageStorage';

export function makeCreateNewProductController() {
  const dbClient = prisma;
  const createProductRepository = new CreateProductRepository(dbClient);
  const createMovementRepository = new CreateMovementsRepository(dbClient);
  const createProductSupplier = new CreateProductSupplierRepository(dbClient);
  const createProductCategory = new CreateProductCategoryRepository(dbClient);
  const productImageStorageAdapter = new ProductImageStorage();

  const createNewProductUseCase = new CreateProductUseCase(
    createProductRepository,
    createMovementRepository,
    createProductSupplier,
    createProductCategory,
    productImageStorageAdapter,
  );

  const createNewProductController = new CreateProductController(
    createNewProductUseCase,
  );
  return createNewProductController;
}
