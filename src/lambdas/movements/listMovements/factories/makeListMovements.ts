import {prisma} from '../../../../../prisma/prismaClient';
import {ListMovementsRepository} from '../../../../common/repositories/movement/listMovementsRepository';
import {ListMovementsUseCase} from '../domain/listMovementsUseCase';
import {ListMovementsController} from '../ports/controller/listMovementsController';

export function makeListMovementsController() {
  const dbClient = prisma;
  const listMovementsRepository = new ListMovementsRepository(dbClient);
  const listMovementsUseCase = new ListMovementsUseCase(
    listMovementsRepository,
  );
  const listMovementsController = new ListMovementsController(
    listMovementsUseCase,
  );

  return listMovementsController;
}
