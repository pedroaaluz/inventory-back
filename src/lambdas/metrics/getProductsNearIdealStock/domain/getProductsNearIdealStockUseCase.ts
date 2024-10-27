import {UseCase} from '../../../../common/interfaces';
import {z} from 'zod';
import {GetProductsNearIdealStockRepository} from '../../../../common/repositories/metrics/getProductsNearIdealStockRepository';
import {requestSchema} from '../schema';

export class GetProductsNearIdealStockUseCase
  implements
    UseCase<
      z.infer<typeof requestSchema.shape.pathParameters> &
        z.infer<typeof requestSchema.shape.queryStringParameters>,
      {
        productsNearIdealStock: {
          id: string;
          name: string;
          image: string | null;
          stockQuantity: number;
          minimumIdealStock: number;
        }[];
        page: number;
        pageSize: number;
        totalProducts: number;
        totalPages: number;
      }
    >
{
  constructor(
    private readonly getProductsNearIdealStockRepository: GetProductsNearIdealStockRepository,
  ) {}

  async exec(
    input: z.infer<typeof requestSchema.shape.pathParameters> &
      z.infer<typeof requestSchema.shape.queryStringParameters>,
  ) {
    const userId = input.userId;

    const {productsNearIdealStock, totalCount} =
      await this.getProductsNearIdealStockRepository.exec({
        userId,
        productName: input.productName,
        page: Number(input.page),
        pageSize: Number(input.pageSize),
      });

    return {
      productsNearIdealStock,
      page: Number(input.page),
      pageSize: Number(input.pageSize),
      totalProducts: totalCount,
      totalPages: Math.ceil(totalCount / Number(input.pageSize)),
    };
  }
}
