import {Controller} from '../../../../../common/interfaces';
import {ListMovementsUseCase} from '../../domain/listMovementsUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';
import {endOfDay, startOfDay} from 'date-fns';
import {normalizeName} from '../../../../../common/string/normalize';
import {formatInTimeZone} from 'date-fns-tz';

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
        movementType,
        paymentMethod,
      } = event.queryStringParameters || {};

      const productsIds = event.multiValueQueryStringParameters?.productsIds;

      const skip = Number(pageSize) * (Number(page) - 1);

      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      const timeZone = 'America/Sao_Paulo';
      const format = 'yyyy-MM-dd HH:mm:ssXXX';

      const filters = {
        orderBy: orderBy || 'desc',
        startDate: startDate
          ? formatInTimeZone(startDate, timeZone, format)
          : formatInTimeZone(startOfDay(sevenDaysAgo), timeZone, format),
        endDate: endDate
          ? formatInTimeZone(endDate, timeZone, format)
          : formatInTimeZone(endOfDay(today), timeZone, format),
        page: Number(page),
        pageSize: Number(pageSize),
        userId,
        skip,
        productName: productName ? normalizeName(productName) : undefined,
        productsIds,
        movementType,
        paymentMethod,
      };

      const {count, movements, totalPages} =
        await this.listMovementsUseCase.exec(filters);

      return {
        statusCode: 200,
        body: {
          message: 'Movements listed successfully',
          page: Number(page),
          pageSize: Number(pageSize),
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
