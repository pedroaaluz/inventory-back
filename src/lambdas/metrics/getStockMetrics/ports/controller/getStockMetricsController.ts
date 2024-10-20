import {Controller} from '../../../../../common/interfaces';
import {GetStockMetricsUseCase} from '../../domain/getStockMetricsUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';
import {endOfDay, parseISO, startOfDay} from 'date-fns';
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
      startDate: (startDate
        ? startOfDay(parseISO(startDate))
        : startOfDay(sevenDaysAgo)
      ).toISOString(),
      endDate: (endDate
        ? endOfDay(parseISO(endDate))
        : endOfDay(today)
      ).toISOString(),
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
