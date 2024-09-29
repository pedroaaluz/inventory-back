import {PrismaClient} from '@prisma/client';
import {CreateSupplierRepository} from '../ports/repositories/createSupplierRepository';
import {CreateSupplierUseCase} from '../domain/createSupplierUseCase';
import {CreateSupplierController} from '../ports/controllers/createSupplierController';
import {SupplierImageStorage} from '../../../../common/infrastructure/supplierImageStorage';

export function makeCreateSupplier() {
  const dbClient = new PrismaClient();

  const supplierImageStorageAdapter = new SupplierImageStorage();
  const createSupplierRepository = new CreateSupplierRepository(dbClient);
  const createSupplierUseCase = new CreateSupplierUseCase(
    createSupplierRepository,
    supplierImageStorageAdapter,
  );
  const createSupplierController = new CreateSupplierController(
    createSupplierUseCase,
  );

  return createSupplierController;
}
