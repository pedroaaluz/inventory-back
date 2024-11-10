import {DeleteSupplierController} from '../ports/controllers/deleteSupplierController';
import {DeleteSupplierUseCase} from '../domain/deleteSupplierUseCase';
import {prisma} from '../../../../../prisma/prismaClient';
import {DeleteSupplierRepository} from '../../../../common/repositories/suppliers/deleteSupplierRepository';

export function MakeDeleteSupplierController() {
  const deleteSupplierRepository = new DeleteSupplierRepository(prisma);
  const deleteSupplierUseCase = new DeleteSupplierUseCase(
    deleteSupplierRepository,
  );
  const getSupplierController = new DeleteSupplierController(
    deleteSupplierUseCase,
  );

  return getSupplierController;
}
