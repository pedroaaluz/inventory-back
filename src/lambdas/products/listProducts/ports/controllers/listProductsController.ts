import {Controller} from '../../../../../common/interfaces';
import {ListProductsUseCase} from '../../domain/listProductsUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';

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

      const filters = {
        orderBy: orderBy || 'desc',
        startDate: startDate,
        endDate: endDate,
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
          page: Number(page),
          pageSize: Number(pageSize),
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
