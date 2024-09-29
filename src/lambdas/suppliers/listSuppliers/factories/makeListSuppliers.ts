import {PrismaClient} from '@prisma/client';
import {ListSuppliersUseCase} from '../domain/listSuppliersUseCase';
import {ListSuppliersController} from '../ports/controllers/listSuppliersController';
import {ListSuppliersRepository} from '../../../../common/repositories/suppliers/listSuppliersRepository';

export function makeListSuppliers() {
  const prismaClient = new PrismaClient();
  const listSuppliersRepository = new ListSuppliersRepository(prismaClient);
  const listSuppliersUseCase = new ListSuppliersUseCase(
    listSuppliersRepository,
  );
  const listSuppliersController = new ListSuppliersController(
    listSuppliersUseCase,
  );
  return listSuppliersController;
}
