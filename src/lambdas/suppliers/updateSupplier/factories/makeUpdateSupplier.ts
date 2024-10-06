import {PrismaClient} from '@prisma/client';
import {UpdateSupplierUseCase} from '../domain/updateSupplierUseCase';
import {UpdateSupplierRepository} from '../../../../common/repositories/suppliers/updateSupplierRepository';
import {GetSupplierRepository} from '../../../../common/repositories/suppliers/getSupplierRepository';
import {UpdateSupplierController} from '../ports/controllers/updateSupplierController';
import {SupplierImageStorage} from '../../../../common/infrastructure/supplierImageStorage';

export function makeUpdateSupplierController() {
  const dbClient = new PrismaClient();

  const updateSupplierRepository = new UpdateSupplierRepository(dbClient);
  const getSupplierRepository = new GetSupplierRepository(dbClient);
  const supplierImageStorageAdapter = new SupplierImageStorage();

  const updateSupplierUseCase = new UpdateSupplierUseCase(
    updateSupplierRepository,
    getSupplierRepository,
    supplierImageStorageAdapter,
  );

  const updateSupplierController = new UpdateSupplierController(
    updateSupplierUseCase,
  );
  return updateSupplierController;
}
