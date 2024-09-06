import {Controller} from '../../../../common/interfaces';
import {UpdateProductUseCase} from '../../domain/UpdateProductUseCase';
import {requestSchema, responseSchema} from '../../schema';
import { HttpEvent, HttpResponse } from '../../../../common/types/lambdasTypes';
import {z} from 'zod';

export class UpdateProductController 
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<
        | HttpResponse<z.infer<(typeof responseSchema)['200']>>
        | HttpResponse<z.infer<(typeof responseSchema)['404']>>
      > 
    >
{
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {}

  async exec(
    event: HttpEvent<z.infer<typeof requestSchema>>,
  ): Promise<
    | HttpResponse<z.infer<(typeof responseSchema)['200']>>
    | HttpResponse<z.infer<(typeof responseSchema)['404']>>
  > {
    try {
      const id = event.body.id;

      if (id == null) {
        return {
          statusCode: 400,
          body: {
            message: 'Id para atualização não informado',
          },
        };
      }

      const result = await this.updateProductUseCase.exec(event);

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
          product: {
            id: result.product.id,
            name: result.product.name,
            categoryId: result.category || [],
            supplierId: result.supplierId || [],
            image: result.product.image,
            description: result.product.description,
            stockQuantity: result.product.stockQuantity,
            unitPrice: Number(result.product.unitPrice),
            positionInStock: result.product.positionInStock,
          },
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: {
          message: 'Internal Server Error',
        },
      };
    }
  }
}
