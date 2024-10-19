import {Controller} from '../../../../../common/interfaces';
import {listCategoriesUseCase} from '../../domain/listCategoriesUseCase';
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
  constructor(private readonly listProductUseCase: listCategoriesUseCase) {}

  async exec(
    event: HttpEvent<z.infer<typeof requestSchema>>,
  ): Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>> {
    try {
      const {name} = event.queryStringParameters || {};

      const filters = {
        name,
      };

      const {categories} = await this.listProductUseCase.exec(filters);

      return {
        statusCode: 200,
        body: {
          message: 'Products listed successfully',
          categories,
        },
      };
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
