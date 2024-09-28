import {Controller} from '../../../../common/interfaces';
import {CreateSupplierUseCase} from '../../domain/createSupplierUseCase';
import {HttpEvent, HttpResponse} from '../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';

export class CreateSupplierController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(private readonly createSupplierUseCase: CreateSupplierUseCase) {}

  async exec(event: HttpEvent<z.infer<typeof requestSchema>>) {
    const result = await this.createSupplierUseCase.exec(event.body);

    return {
      statusCode: 200,
      body: {
        message: 'Product created!',
        supplier: {
          id: result.id,
          name: result.name,
          userId: result.userId,
          createdAt: result.createdAt.toISOString(),
          deletedAt: result.deletedAt ? result.deletedAt.toISOString() : null,
          updatedAt: result.updatedAt.toISOString(),
          cnpj: result.cnpj,
          address: result.address,
          phone: result.phone,
          email: result.email,
          image: result.image,
        },
      },
    };
  }
}
