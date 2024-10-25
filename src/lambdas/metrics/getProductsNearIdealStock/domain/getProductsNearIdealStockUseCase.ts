import {UseCase} from '../../../../common/interfaces';
import {z} from 'zod';
import {GetProductsNearIdealStockRepository} from '../../../../common/repositories/metrics/getProductsNearIdealStockRepository';
import {requestSchema} from '../schema';

export class GetProductsNearIdealStockUseCase
  implements
    UseCase<
      z.infer<typeof requestSchema.shape.pathParameters>,
      {
        productsNearIdealStock: {
          id: string;
          name: string;
          image: string | null;
          stockQuantity: number;
          minimumIdealStock: number;
        }[];
      }
    >
{
  constructor(
    private readonly getProductsNearIdealStockRepository: GetProductsNearIdealStockRepository,
  ) {}

  async exec(
    input: z.infer<typeof requestSchema.shape.pathParameters> & {
      userId: string;
    },
  ) {
    const userId = input.userId;

    const productsNearIdealStock =
      await this.getProductsNearIdealStockRepository.exec({
        userId,
      });

    return {
      productsNearIdealStock,
    };
  }
}
