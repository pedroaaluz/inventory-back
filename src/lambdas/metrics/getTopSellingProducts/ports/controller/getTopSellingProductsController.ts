import {Controller} from '../../../../../common/interfaces';
import {GetTopSellingProductsUseCase} from '../../domain/getTopSellingProductsUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';
import {endOfDay, parseISO, startOfDay} from 'date-fns';

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
    const {startDate, endDate, page, pageSize} =
      event.queryStringParameters || {};

    const today = new Date();
    const sevenDaysAgo = today.setDate(today.getDate() - 7);
    const pageNumber = Number(page) || 1;
    const pageSizeNumber = Number(pageSize) || 10;

    const {products, totalProducts} =
      await this.getTopSellingProductsUseCase.exec({
        userId,
        startDate: (startDate
          ? startOfDay(parseISO(startDate))
          : startOfDay(sevenDaysAgo)
        ).toISOString(),
        endDate: (endDate
          ? endOfDay(parseISO(endDate))
          : endOfDay(today)
        ).toISOString(),
        page: pageNumber,
        pageSize: pageSizeNumber,
      });

    return {
      statusCode: 200,
      body: {
        products,
        message: 'Top selling products listed successfully',
        totalProducts,
        totalPages: Math.ceil(totalProducts / Number(pageSize)),
        page: pageNumber,
        pageSize: pageSizeNumber,
      },
    };
  }
}
