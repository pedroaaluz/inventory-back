import {UseCase} from '../../../common/interfaces';
import {ListMovementsRepository} from '../../../common/repositories/movement/listMovementsRepository';
import {
  TListMovementsInputUseCase,
  IListMovementsRepositoryOutput,
} from '../../../common/types/movement';
export class ListMovementsUseCase
  implements
    UseCase<TListMovementsInputUseCase, IListMovementsRepositoryOutput>
{
  constructor(
    private readonly listMovementsRepository: ListMovementsRepository,
  ) {}

  async exec(input: TListMovementsInputUseCase) {
    try {
      console.log('Filters from request', input);

      const movementFilterDTO = {
        userId: input.userId,
        startDate: input.startDate,
        endDate: input.endDate,
        orderBy: input.orderBy,
        pageSize: input.pageSize,
        skip: input.skip,
      };

      const movements = await this.listMovementsRepository.exec(
        movementFilterDTO,
      );

      return movements;
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
