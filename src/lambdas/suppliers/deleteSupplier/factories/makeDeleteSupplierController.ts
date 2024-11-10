import {DeleteSupplierController} from '../ports/controllers/deleteSupplierController';
import {DeleteSupplierUseCase} from '../domain/deleteSupplierUseCase';
import {prisma} from '../../../../../prisma/prismaClient';
import {DeleteSupplierRepository} from '../../../../common/repositories/suppliers/deleteSupplierRepository';
import {DeleteProductSupplierRepository} from '../../../../common/repositories/productSupplier/deleteProductSupplierRepository';

export function MakeDeleteSupplierController() {
  const deleteSupplierRepository = new DeleteSupplierRepository(prisma);
  const deleteProductSupplierRepository = new DeleteProductSupplierRepository(
    prisma,
  );

  const deleteSupplierUseCase = new DeleteSupplierUseCase(
    deleteSupplierRepository,
    deleteProductSupplierRepository,
  );
  const getSupplierController = new DeleteSupplierController(
    deleteSupplierUseCase,
  );

  return getSupplierController;
}
