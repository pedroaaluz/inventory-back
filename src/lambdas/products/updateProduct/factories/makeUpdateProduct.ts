import {PrismaClient} from '@prisma/client';
import {UpdateProductUseCase} from '../domain/updateProductUseCase';
import {UpdateProductRepository} from '../../../../common/repositories/product/updateProductRepository';
import {GetProductRepository} from '../../../../common/repositories/product/getProductRepository';
import {CreateMovementsRepository} from '../../../../common/repositories/movement/createMovementRepository';
import {UpdateProductController} from '../ports/controllers/updateProductController';
import {ProductImageStorage} from '../../../../common/infrastructure/productImageStorage';
import {DeleteProductCategoryRepository} from '../../../../common/repositories/productCategory/deleteProductCategoryRepository';
import {DeleteProductSupplierRepository} from '../../../../common/repositories/productSupplier/deleteProductSupplierRepository';
import {UpsertProductCategoryRepository} from '../../../../common/repositories/productCategory/upsertProductCategoryRepository';
import {UpsertProductSupplierRepository} from '../../../../common/repositories/productSupplier/upsertProductSupplierRepository';

export function makeUpdateProductController() {
  const dbClient = new PrismaClient();

  const updateProductRepository = new UpdateProductRepository(dbClient);
  const getProductRepository = new GetProductRepository(dbClient);
  const createNewMovementRepository = new CreateMovementsRepository(dbClient);
  const productImageStorageAdapter = new ProductImageStorage();
  const deleteProductCategoryRepository = new DeleteProductCategoryRepository(
    dbClient,
  );
  const deleteProductSupplierRepository = new DeleteProductSupplierRepository(
    dbClient,
  );
  const upsertProductCategoryRepository = new UpsertProductCategoryRepository(
    dbClient,
  );
  const upsertProductSupplierRepository = new UpsertProductSupplierRepository(
    dbClient,
  );

  const updateProductUseCase = new UpdateProductUseCase(
    updateProductRepository,
    getProductRepository,
    createNewMovementRepository,
    deleteProductCategoryRepository,
    deleteProductSupplierRepository,
    upsertProductCategoryRepository,
    upsertProductSupplierRepository,
    productImageStorageAdapter,
  );

  const updateProductController = new UpdateProductController(
    updateProductUseCase,
  );
  return updateProductController;
}
