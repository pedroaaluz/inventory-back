import {UseCase} from '../../../common/interfaces';
import {CreateNewMovementRepository} from '../../../common/repositories/CreateNewMovementRepository';
import {CreateNewProductRepository} from '../ports/repositories/CreateNewProductRepository';
import {HttpEvent} from '../../../common/types/lambdasTypes';
import {requestSchema} from '../schema';
import {Product} from '@prisma/client';
import {z} from 'zod';

export class CreateNewProductUseCase
  implements UseCase<HttpEvent<z.infer<typeof requestSchema>>, Product>
{
  constructor(
    private readonly createNewProductRepository: CreateNewProductRepository,
    private readonly createNewMovementRepository: CreateNewMovementRepository,
  ) {}

  async exec({body: input}: HttpEvent<z.infer<typeof requestSchema>>) {
    const productDTO = {
      name: input.name,
      userId: input.userId,
      image: input.image,
      unitPrice: input.unitPrice,
      supplierId: input.supplierId,
      description: input.description,
      stockQuantity: input.stockQuantity,
      categoryId: input.categoryId,
      expirationDate: input.expirationDate && new Date(input.expirationDate),
      positionInStock: input.positionInStock,
    };

    console.log('ProductDTO', productDTO);

    const product = await this.createNewProductRepository.exec(productDTO);

    console.log('Created Product', product);

    return product;
  }
}
