import {UseCase} from '../../../../common/interfaces';
import {
  TListCategoriesOutput,
  TListCategoryInput,
} from '../../../../common/types/category';
import {ListCategoriesRepository} from '../../../../common/repositories/categories/listCategoriesRepository';

export class listCategoriesUseCase
  implements UseCase<TListCategoryInput, TListCategoriesOutput>
{
  constructor(
    private readonly listCategoriesRepository: ListCategoriesRepository,
  ) {}

  async exec(input: TListCategoryInput) {
    try {
      console.log('Filters from request', input);

      const categoryFilterDTO = {
        name: input.name,
      };

      const categories = await this.listCategoriesRepository.exec(
        categoryFilterDTO,
      );

      return categories;
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
