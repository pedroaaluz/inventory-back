import {Controller} from '../../../../../common/interfaces';
import {UpdateSupplierUseCase} from '../../domain/updateSupplierUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';

export class UpdateSupplierController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(private readonly updateSupplierUseCase: UpdateSupplierUseCase) {}

  async exec(event: HttpEvent<z.infer<typeof requestSchema>>) {
    const result = await this.updateSupplierUseCase.exec({
      ...event.body,
      id: event.pathParameters.id,
    });

    return {
      statusCode: 200,
      body: {
        message: 'Supplier updated!',
        supplier: result,
      },
    };
  }
}
