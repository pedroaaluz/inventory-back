import {prisma} from '../../../../../prisma/prismaClient';
import {ListCategoriesRepository} from '../../../../common/repositories/categories/listCategoriesRepository';
import {listCategoriesUseCase} from '../domain/listCategoriesUseCase';
import {ListProductsController} from '../ports/controllers/listProductsController';

export function makeListCategoriesController() {
  const listCategoriesRepository = new ListCategoriesRepository(prisma);
  const listProductsUseCase = new listCategoriesUseCase(
    listCategoriesRepository,
  );
  const listProductsController = new ListProductsController(
    listProductsUseCase,
  );
  return listProductsController;
}
