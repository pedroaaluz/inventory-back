import {Controller} from '../../../../../common/interfaces';
import {ListProductsUseCase} from '../../domain/listProductsUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';
import {startOfDay, endOfDay} from 'date-fns';
import {formatInTimeZone} from 'date-fns-tz';

export class ListProductsController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(private readonly listProductUseCase: ListProductsUseCase) {}

  async exec(
    event: HttpEvent<z.infer<typeof requestSchema>>,
  ): Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>> {
    try {
      const {categoriesIds, suppliersIds} =
        event.multiValueQueryStringParameters || {};

      const {
        startDate,
        endDate,
        page = 1,
        pageSize = 10,
        orderBy,
        name,
        userId,
      } = event.queryStringParameters || {};

      const skip = Number(pageSize) * (Number(page) - 1);

      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      const timeZone = 'America/Sao_Paulo';
      const format = 'yyyy-MM-dd HH:mm:ssXXX';

      const filters = {
        orderBy: orderBy || 'desc',
        startDate: startDate
          ? formatInTimeZone(new Date(startDate), timeZone, format)
          : formatInTimeZone(startOfDay(sevenDaysAgo), timeZone, format),
        endDate: endDate
          ? formatInTimeZone(new Date(endDate), timeZone, format)
          : formatInTimeZone(endOfDay(today), timeZone, format),
        page: Number(page),
        pageSize: Number(pageSize),
        categoriesIds,
        suppliersIds,
        skip,
        userId,
        name,
      };

      const result = await this.listProductUseCase.exec(filters);

      return {
        statusCode: 200,
        body: {
          message: 'Products listed successfully',
          page: page,
          pageSize: pageSize,
          totalProducts: result.count,
          totalPages: result.totalPages,
          products: result.products,
        },
      };
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
