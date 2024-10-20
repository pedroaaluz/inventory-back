import {Controller} from '../../../../../common/interfaces';
import {ListSuppliersUseCase} from '../../domain/listSuppliersUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';
import {endOfDay, startOfDay} from 'date-fns';
import {formatInTimeZone} from 'date-fns-tz';

export class ListSuppliersController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(private readonly listSuppliersUseCase: ListSuppliersUseCase) {}

  async exec(
    event: HttpEvent<z.infer<typeof requestSchema>>,
  ): Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>> {
    try {
      const {suppliersIds} = event.multiValueQueryStringParameters || {};

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

      const timeZone = 'America/Sao_Paulo';
      const format = 'yyyy-MM-dd HH:mm:ssXXX';

      const filters = {
        orderBy: orderBy || 'desc',
        startDate: startDate && formatInTimeZone(startDate, timeZone, format),
        endDate: endDate && formatInTimeZone(endDate, timeZone, format),
        page: Number(page),
        pageSize: Number(pageSize),
        suppliersIds,
        skip,
        userId,
        name,
      };

      const result = await this.listSuppliersUseCase.exec(filters);

      return {
        statusCode: 200,
        body: {
          message: 'Suppliers listed successfully',
          page: Number(page),
          pageSize: Number(pageSize),
          totalSuppliers: result.count,
          totalPages: result.totalPages,
          suppliers: result.suppliers,
        },
      };
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
