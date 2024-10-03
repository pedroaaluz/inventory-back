import {Controller} from '../../../../../common/interfaces';
import {ListMovementsUseCase} from '../../domain/listMovementsUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';
import {format} from 'date-fns';
import {normalizeName} from '../../../../../common/string/normalize';

export class ListMovementsController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(private readonly listMovementsUseCase: ListMovementsUseCase) {}

  async exec(
    event: HttpEvent<z.infer<typeof requestSchema>>,
  ): Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>> {
    try {
      const {userId} = event.pathParameters || {};
      const {
        startDate,
        endDate,
        page = 1,
        pageSize = 10,
        orderBy,
        productName,
        productsIds,
      } = event.queryStringParameters || {};

      const skip = Number(pageSize) * (Number(page) - 1);

      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      const filters = {
        orderBy: orderBy || 'desc',
        startDate: startDate || format(sevenDaysAgo, 'yyyy-MM-dd HH:mm:ss'),
        endDate: endDate || format(today, 'yyyy-MM-dd HH:mm:ss'),
        page: Number(page),
        pageSize: Number(pageSize),
        userId,
        skip,
        productName: productName ? normalizeName(productName) : undefined,
        productsIds,
      };

      const {count, movements, totalPages} =
        await this.listMovementsUseCase.exec(filters);

      return {
        statusCode: 200,
        body: {
          message: 'Movements listed successfully',
          page: page,
          pageSize: pageSize,
          totalMovements: count,
          totalPages: totalPages,
          movements,
        },
      };
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
