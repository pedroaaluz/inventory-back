import {UseCase} from '../../../common/interfaces';
import {GetProductRepository} from '../../../common/repositories/product/getProductRepository';
import {requestSchema, responseSchema} from '../schema';
import type {Product} from '@prisma/client';
import {z} from 'zod';

export class GetProductUseCase implements UseCase<z.infer<typeof requestSchema.shape.body>, { product: Product, supplierId: string[], category: string[]}| null> {
  constructor(private readonly getProductRepository: GetProductRepository) {}

  async exec(input: z.infer<typeof requestSchema.shape.body>) {
    const productDTO = {
      productId: input.id,
    };

    console.log('Product', productDTO);

    const product = await this.getProductRepository.exec({id: productDTO.productId});

    if(product === null) {
      return null;
    }

    return product;
  }
}
