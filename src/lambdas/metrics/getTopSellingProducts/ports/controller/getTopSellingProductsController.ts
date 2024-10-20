import {Controller} from '../../../../../common/interfaces';
import {GetTopSellingProductsUseCase} from '../../domain/getTopSellingProductsUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';
import {endOfDay, startOfDay} from 'date-fns';
import {formatInTimeZone} from 'date-fns-tz';

export class GetTopSellingProductsController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(
    private readonly getTopSellingProductsUseCase: GetTopSellingProductsUseCase,
  ) {}

  async exec(
    event: HttpEvent<z.infer<typeof requestSchema>>,
  ): Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>> {
    const {userId} = event.pathParameters;
    const {startDate, endDate} = event.queryStringParameters || {};

    const today = new Date();
    const sevenDaysAgo = today.setDate(today.getDate() - 7);
    const timeZone = 'America/Sao_Paulo';
    const format = 'yyyy-MM-dd HH:mm:ssXXX';

    const {products} = await this.getTopSellingProductsUseCase.exec({
      userId,
      startDate: startDate
        ? formatInTimeZone(startDate, timeZone, format)
        : formatInTimeZone(startOfDay(sevenDaysAgo), timeZone, format),
      endDate: endDate
        ? formatInTimeZone(endDate, timeZone, format)
        : formatInTimeZone(endOfDay(today), timeZone, format),
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
