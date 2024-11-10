import {Controller} from '../../../../../common/interfaces';
import {requestSchema, responseSchema} from '../../schema';
import {DeleteProductUseCase} from '../../domain/deleteProductUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {z} from 'zod';

export class DeleteProductController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<
        | HttpResponse<z.infer<(typeof responseSchema)['200']>>
        | HttpResponse<z.infer<(typeof responseSchema)['404']>>
      >
    >
{
  constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {}

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

      const result = await this.deleteProductUseCase.exec(id);

      if (result === null) {
        return {
          statusCode: 404,
          body: {
            message: 'Product not found',
          },
        };
      }

      return {
        statusCode: 200,
        body: {
          message: 'Product deleted',
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
