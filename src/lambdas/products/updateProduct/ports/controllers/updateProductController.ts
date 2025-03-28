import {Controller} from '../../../../../common/interfaces';
import {UpdateProductUseCase} from '../../domain/updateProductUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';

export class UpdateProductController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {}

  async exec(event: HttpEvent<z.infer<typeof requestSchema>>) {
    const result = await this.updateProductUseCase.exec({
      ...event.body,
      id: event.pathParameters.id,
    });

    return {
      statusCode: 200,
      body: {
        message: 'Product updated!',
        product: result,
      },
    };
  }
}
