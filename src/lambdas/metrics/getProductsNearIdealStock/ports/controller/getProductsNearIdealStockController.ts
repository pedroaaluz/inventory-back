import {Controller} from '../../../../../common/interfaces';
import {GetProductsNearIdealStockUseCase} from '../../domain/getProductsNearIdealStockUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';

export class GetProductsNearIdealStockController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(
    private readonly getProductsNearIdealStockUseCase: GetProductsNearIdealStockUseCase,
  ) {}

  async exec(event: HttpEvent<z.infer<typeof requestSchema>>) {
    const result = await this.getProductsNearIdealStockUseCase.exec(
      event.pathParameters,
    );

    return {
      statusCode: 200,
      body: {
        message: 'Products near ideal stock fetch!',
        ...result,
      },
    };
  }
}
