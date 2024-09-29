import {GetSupplierController} from '../ports/controllers/getSupplierController';
import {GetSupplierRepository} from '../../../../common/repositories/suppliers/getSupplierRepository';
import {GetSupplierUseCase} from '../domain/getSupplierUseCase';
import {prisma} from '../../../../../prisma/prismaClient';

export function MakeGetSupplierController() {
  const getSupplierRepository = new GetSupplierRepository(prisma);
  const getSupplierUseCase = new GetSupplierUseCase(getSupplierRepository);
  const getSupplierController = new GetSupplierController(getSupplierUseCase);

  return getSupplierController;
}
