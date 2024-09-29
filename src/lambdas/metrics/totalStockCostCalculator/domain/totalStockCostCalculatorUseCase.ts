import {UseCase} from '../../../../common/interfaces';
import {z} from 'zod';
import {TotalStockCostCalculatorRepository} from '../../../../common/repositories/metrics/totalStockCostCalculatorRepository';
import {requestSchema} from '../schema';

export class TotalStockCostCalculatorUseCase
  implements
    UseCase<
      z.infer<typeof requestSchema.shape.pathParameters>,
      {totalStockCost: number}
    >
{
  constructor(
    private readonly totalStockCostCalculatorRepository: TotalStockCostCalculatorRepository,
  ) {}

  async exec(
    input: z.infer<typeof requestSchema.shape.pathParameters> & {
      userId: string;
    },
  ) {
    const userId = input.userId;

    console.log('userId', userId);

    const totalStockCost = await this.totalStockCostCalculatorRepository.exec({
      userId,
    });

    console.log('totalStockCost', totalStockCost);

    return {
      totalStockCost,
    };
  }
}
