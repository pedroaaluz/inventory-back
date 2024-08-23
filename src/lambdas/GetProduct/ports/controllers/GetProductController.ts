import {APIGatewayEvent} from 'aws-lambda';
import {Controller} from '../../../../common/interfaces';
import { requestSchema, responseSchema } from '../../schema';
import {GetProductUseCase} from '../../domain/GetProductUseCase';
import { HttpEvent, HttpResponse } from '../../../../common/types/lambdasTypes';
import {z} from 'zod'

export class GetProductController 
  implements 
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>> | HttpResponse<z.infer<(typeof responseSchema)['404']>>>
    >
{
  constructor(private readonly getProductUseCase: GetProductUseCase) {}

  async exec(event: HttpEvent<z.infer<typeof requestSchema>>): Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>> | HttpResponse<z.infer<(typeof responseSchema)['404']>>> {
    try {
      const {id} = event.body || {};

      const result = await this.getProductUseCase.exec({id});

      if (result === null) {
        return {
          statusCode: 404,
          body:{
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
            categoryId: result.category,
            supplierId: result.supplierId,
            image: result.product.image,
            description: result.product.description,
            stockQuantity: result.product.stockQuantity,
            unitPrice: Number(result.product.unitPrice),
            positionInStock: result.product.positionInStock,
            expirationDate: result.product.expirationDate,
            createdAt: result.product.createdAt,
            deletedAt: result.product.deletedAt,
            updatedAt: result.product.updatedAt,
          }

        },
      };
    } catch (error) {
      console.log('error', error);
      
      return {
        statusCode: 500,
        body: {
          message: 'Internal Server Error',
        }, 
      }
    }
  }
}
