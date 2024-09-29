import {UseCase} from '../../../common/interfaces';
import {
  TListSuppliersInput,
  IListSuppliersOutput,
} from '../../../common/types/supplier';
import {ListSuppliersRepository} from '../../../common/repositories/suppliers/listSuppliersRepository';

export class ListSuppliersUseCase
  implements UseCase<TListSuppliersInput, IListSuppliersOutput>
{
  constructor(
    private readonly listSuppliersRepository: ListSuppliersRepository,
  ) {}

  async exec(listSuppliersInput: TListSuppliersInput) {
    try {
      console.log('Filters from request', listSuppliersInput);

      const suppliers = await this.listSuppliersRepository.exec(
        listSuppliersInput,
      );

      return suppliers;
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
