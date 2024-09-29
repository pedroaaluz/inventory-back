import {UseCase} from '../../../../common/interfaces';
import {
  TListProductsInput,
  IListProductsOutput,
} from '../../../../common/types/product';
import {ListProductsRepository} from '../../../../common/repositories/product/listProductsRepository';
import {normalizeName} from '../../../../common/string/normalize';

export class ListProductsUseCase
  implements UseCase<TListProductsInput, IListProductsOutput>
{
  constructor(private readonly listProductRepository: ListProductsRepository) {}

  async exec(input: TListProductsInput) {
    try {
      console.log('Filters from request', input);

      const productFilterDTO = {
        userId: input.userId,
        categoriesIds: input.categoriesIds ? input.categoriesIds : [],
        suppliersIds: input.suppliersIds ? input.suppliersIds : [],
        startDate: input.startDate,
        endDate: input.endDate,
        orderBy: input.orderBy,
        skip: input.skip,
        pageSize: input.pageSize,
        name: input.name && normalizeName(input.name),
        page: input.page,
      };

      const products: IListProductsOutput =
        await this.listProductRepository.exec(productFilterDTO);

      return products;
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
