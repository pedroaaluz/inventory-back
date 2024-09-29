import {UseCase} from '../../../../common/interfaces';
import {Prisma, Product} from '@prisma/client';
import {z} from 'zod';
import {CreateMovementsRepository} from '../../../../common/repositories/movement/createMovementRepository';
import {CreateProductRepository} from '../../../../common/repositories/product/createProductRepository';
import {requestSchema} from '../schema';
import {CreateProductCategoryRepository} from '../../../../common/repositories/productCategory/createProductCategoryRepository';
import {CreateProductSupplierRepository} from '../../../../common/repositories/productSupplier/createProductSupplierRepository';
import {normalizeName} from '../../../../common/string/normalize';
import {ProductImageStorage} from '../../../../common/infrastructure/productImageStorage';
import {randomUUID} from 'crypto';

export class CreateProductUseCase
  implements UseCase<z.infer<typeof requestSchema.shape.body>, Product>
{
  constructor(
    private readonly createProductRepository: CreateProductRepository,
    private readonly createMovementRepository: CreateMovementsRepository,
    private readonly createProductSupplierRepository: CreateProductSupplierRepository,
    private readonly createProductCategoryRepository: CreateProductCategoryRepository,
    private readonly productImageStorageAdapter: ProductImageStorage,
  ) {}

  async exec(input: z.infer<typeof requestSchema.shape.body>) {
    const productId = randomUUID();

    const productDTO = {
      id: productId,
      name: input.name,
      userId: input.userId,
      unitPrice: input.unitPrice,
      supplierId: input.supplierId,
      stockQuantity: input.stockQuantity,
      categoryId: input.categoryId,
      image: input.image
        ? await this.productImageStorageAdapter.uploadFile(
            input.image,
            `${input.userId}/${productId}.jpg`,
          )
        : null,
      nameNormalized: normalizeName(input.name),
      description: input.description ?? null,
      expirationDate: input.expirationDate
        ? new Date(input.expirationDate)
        : null,
      positionInStock: input.positionInStock ?? null,
      minimumIdealStock: input.minimumIdealStock ?? null,
      productionCost: input.productionCost ?? null,
    };

    console.log('creating product...');

    const product = await this.createProductRepository.exec(productDTO);

    console.log('product created');

    console.log('creating movement...');

    await this.createMovementRepository.exec({
      movementType: 'ADD_TO_STOCK',
      productId: product.id,
      productName: product.name,
      productNameNormalized: product.nameNormalized,
      quantity: product.stockQuantity,
      userId: product.userId,
      movementValue: new Prisma.Decimal(
        Number(product.stockQuantity) * Number(product.productionCost),
      ),
      paymentMethod: input.paymentMethod ?? null,
    });

    console.log('movement created');

    console.log('creating productSupplier...');

    await this.createProductSupplierRepository.exec({
      productId: product.id,
      supplierId: productDTO.supplierId,
    });

    console.log('movement productSupplier');

    console.log('creating productCategory...');

    await this.createProductCategoryRepository.exec({
      productId: product.id,
      categoryId: productDTO.categoryId,
    });

    console.log('movement productCategory');

    return product;
  }
}
