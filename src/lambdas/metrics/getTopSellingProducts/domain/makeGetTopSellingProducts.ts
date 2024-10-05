import {UseCase} from '../../../../common/interfaces';
import {GetTopSellingProductsRepository} from '../../../../common/repositories/metrics/getTopSellingProductsRepository';
import {
  TGetTopSellingProductsInputUseCase,
  IGetTopSellingProductsOutput,
} from '../../../../common/types/metrics';

export class GetTopSellingProductsUseCase
  implements
    UseCase<TGetTopSellingProductsInputUseCase, IGetTopSellingProductsOutput>
{
  constructor(
    private readonly getTopSellingProductsRepository: GetTopSellingProductsRepository,
  ) {}

  async exec(input: TGetTopSellingProductsInputUseCase) {
    try {
      console.log('Filters from request', input);

      const GetTopSellingProductsFilterDTO = {
        userId: input.userId,
        startDate: input.startDate,
        endDate: input.endDate,
      };

      const GetTopSellingProducts =
        await this.getTopSellingProductsRepository.exec(
          GetTopSellingProductsFilterDTO,
        );

      return {products: GetTopSellingProducts};
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
