import {Controller} from '../../../../../common/interfaces';
import {GetStockMetricsUseCase} from '../../domain/getStockMetricsUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';
import {format} from 'date-fns';
import {normalizeName} from '../../../../../common/string/normalize';

export class GetStockMetricsController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(
    private readonly getStockMetricsUseCase: GetStockMetricsUseCase,
  ) {}

  async exec(
    event: HttpEvent<z.infer<typeof requestSchema>>,
  ): Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>> {
    const {userId} = event.pathParameters;
    const {startDate, endDate, productName} = event.queryStringParameters || {};

    const today = new Date();
    const sevenDaysAgo = today.setDate(today.getDate() - 7);

    const {products} = await this.getStockMetricsUseCase.exec({
      userId,
      startDate: startDate || format(sevenDaysAgo, 'yyyy-MM-dd HH:mm:ss'),
      endDate: endDate || format(today, 'yyyy-MM-dd HH:mm:ss'),
      productName: productName ? normalizeName(productName) : undefined,
    });

    return {
      statusCode: 200,
      body: {
        products,
        message: 'Top selling products listed successfully',
      },
    };
  }
}
