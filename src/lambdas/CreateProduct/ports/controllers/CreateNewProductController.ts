import {Controller} from '../../../../common/interfaces';
import {CreateNewProductUseCase} from '../../domain/CreateNewProductUseCase';
import {HttpEvent, HttpResponse} from '../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';

export class CreateNewProductController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(
    private readonly createNewProductUseCase: CreateNewProductUseCase,
  ) {}

  async exec(event: HttpEvent<z.infer<typeof requestSchema>>) {
    const result = await this.createNewProductUseCase.exec(event);

    return {
      statusCode: 200,
      body: {
        message: 'Product created!',
        product: result,
      },
    };
  }
}
