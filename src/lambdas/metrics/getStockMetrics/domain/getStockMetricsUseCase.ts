import {UseCase} from '../../../../common/interfaces';
import {GetStockMetricsRepository} from '../../../../common/repositories/metrics/getStockMetricsRepository';
import {
  TGetStockMetricsInputUseCase,
  IGetStockMetricsOutput,
} from '../../../../common/types/metrics';

export class GetStockMetricsUseCase
  implements UseCase<TGetStockMetricsInputUseCase, IGetStockMetricsOutput>
{
  constructor(
    private readonly getStockMetricsRepository: GetStockMetricsRepository,
  ) {}

  async exec(input: TGetStockMetricsInputUseCase) {
    try {
      console.log('Filters from request', input);

      const getStockMetricsFilterDTO = {
        userId: input.userId,
        startDate: input.startDate,
        endDate: input.endDate,
        productName: input.productName,
      };

      const GetStockMetrics = await this.getStockMetricsRepository.exec(
        getStockMetricsFilterDTO,
      );

      return {products: GetStockMetrics};
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
