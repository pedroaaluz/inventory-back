import {Controller} from '../../../../common/interfaces';
import {CreateMovementsUseCase} from '../../domain/createMovementsUseCase';
import {HttpEvent, HttpResponse} from '../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';

export class CreateMovementsController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(
    private readonly createMovementsUseCase: CreateMovementsUseCase,
  ) {}

  async exec(event: HttpEvent<z.infer<typeof requestSchema>>) {
    const {userId} = event.pathParameters;

    const result = await this.createMovementsUseCase.exec({
      ...event.body,
      userId,
    });

    return {
      statusCode: 200,
      body: {
        message: 'Movements created!',
        ...result,
      },
    };
  }
}
