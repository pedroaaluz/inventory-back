import {Controller} from '../../../../common/interfaces';
import {CreateProductUseCase} from '../../domain/createProductUseCase';
import {HttpEvent, HttpResponse} from '../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';

export class CreateProductController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(private readonly createNewProductUseCase: CreateProductUseCase) {}

  async exec(event: HttpEvent<z.infer<typeof requestSchema>>) {
    const result = await this.createNewProductUseCase.exec(event.body);

    return {
      statusCode: 200,
      body: {
        message: 'Product created!',
        product: result,
      },
    };
  }
}
