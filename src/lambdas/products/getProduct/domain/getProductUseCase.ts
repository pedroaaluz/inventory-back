import {UseCase} from '../../../../common/interfaces';
import {GetProductRepository} from '../../../../common/repositories/product/getProductRepository';
import type {Product} from '@prisma/client';

export class GetProductUseCase
  implements
    UseCase<
      string,
      {product: Product; supplierId: string[]; category: string[]} | null
    >
{
  constructor(private readonly getProductRepository: GetProductRepository) {}

  async exec(input: string) {
    const productDTO = {
      productId: input,
    };

    console.log('Product', productDTO);

    const product = await this.getProductRepository.exec(productDTO.productId);

    if (product == null) {
      return null;
    }

    return product;
  }
}
