import {Controller} from '../../../../../common/interfaces';
import {requestSchema, responseSchema} from '../../schema';
import {DeleteSupplierUseCase} from '../../domain/deleteSupplierUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {z} from 'zod';

export class DeleteSupplierController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<
        | HttpResponse<z.infer<(typeof responseSchema)['200']>>
        | HttpResponse<z.infer<(typeof responseSchema)['404']>>
      >
    >
{
  constructor(private readonly deleteSupplierUseCase: DeleteSupplierUseCase) {}

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

      const result = await this.deleteSupplierUseCase.exec(id);

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
          message: 'Supplier deleted',
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
