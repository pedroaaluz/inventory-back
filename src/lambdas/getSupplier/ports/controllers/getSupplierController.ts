import {Controller} from '../../../../common/interfaces';
import {requestSchema, responseSchema} from '../../schema';
import {GetSupplierUseCase} from '../../domain/getSupplierUseCase';
import {HttpEvent, HttpResponse} from '../../../../common/types/lambdasTypes';
import {z} from 'zod';

export class GetSupplierController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<
        | HttpResponse<z.infer<(typeof responseSchema)['200']>>
        | HttpResponse<z.infer<(typeof responseSchema)['404']>>
      >
    >
{
  constructor(private readonly getProductUseCase: GetSupplierUseCase) {}

  async exec(
    event: HttpEvent<z.infer<typeof requestSchema>>,
  ): Promise<
    | HttpResponse<z.infer<(typeof responseSchema)['200']>>
    | HttpResponse<z.infer<(typeof responseSchema)['404']>>
  > {
    try {
      const id = event.pathParameters?.id;

      if (id == null) {
        return {
          statusCode: 400,
          body: {
            message: 'Bad Request',
          },
        };
      }

      const result = await this.getProductUseCase.exec(id);

      if (result === null) {
        return {
          statusCode: 404,
          body: {
            message: 'Supplier not found',
          },
        };
      }

      return {
        statusCode: 200,
        body: {
          supplier: result.supplier,
        },
      };
    } catch (error) {
      console.log('error', error);

      return {
        statusCode: 500,
        body: {
          message: 'Internal Server Error',
        },
      };
    }
  }
}
