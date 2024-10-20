import {CreateMovementsRepository} from '../../../../common/repositories/movement/createMovementRepository';
import {CreateProductRepository} from '../../../../common/repositories/product/createProductRepository';
import {CreateProductUseCase} from '../domain/createProductUseCase';
import {CreateProductController} from '../ports/controllers/createProductController';
import {UpsertProductSupplierRepository} from '../../../../common/repositories/productSupplier/upsertProductSupplierRepository';
import {UpsertProductCategoryRepository} from '../../../../common/repositories/productCategory/upsertProductCategoryRepository';
import {prisma} from '../../../../../prisma/prismaClient';
import {ProductImageStorage} from '../../../../common/infrastructure/productImageStorage';

export function makeCreateNewProductController() {
  const dbClient = prisma;
  const createProductRepository = new CreateProductRepository(dbClient);
  const createMovementRepository = new CreateMovementsRepository(dbClient);
  const createProductSupplier = new UpsertProductSupplierRepository(dbClient);
  const createProductCategory = new UpsertProductCategoryRepository(dbClient);
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
