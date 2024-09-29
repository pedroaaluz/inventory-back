import {Controller} from '../../../../../common/interfaces';
import {TotalStockCostCalculatorUseCase} from '../../domain/totalStockCostCalculatorUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';

export class TotalStockCostCalculatorUseCaseController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(
    private readonly totalStockCostCalculatorUseCase: TotalStockCostCalculatorUseCase,
  ) {}

  async exec(event: HttpEvent<z.infer<typeof requestSchema>>) {
    const result = await this.totalStockCostCalculatorUseCase.exec(
      event.pathParameters,
    );

    return {
      statusCode: 200,
      body: {
        message: 'Total stock cost fetch!',
        ...result,
      },
    };
  }
}
