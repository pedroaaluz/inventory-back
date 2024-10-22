import {UseCase} from '../../../../common/interfaces';
import {Prisma, Product} from '@prisma/client';
import {z} from 'zod';
import {CreateMovementsRepository} from '../../../../common/repositories/movement/createMovementRepository';
import {CreateProductRepository} from '../../../../common/repositories/product/createProductRepository';
import {requestSchema} from '../schema';
import {UpsertProductCategoryRepository} from '../../../../common/repositories/productCategory/upsertProductCategoryRepository';
import {UpsertProductSupplierRepository} from '../../../../common/repositories/productSupplier/upsertProductSupplierRepository';
import {normalizeName} from '../../../../common/string/normalize';
import {ProductImageStorage} from '../../../../common/infrastructure/productImageStorage';
import {randomUUID} from 'crypto';

export class CreateProductUseCase
  implements UseCase<z.infer<typeof requestSchema.shape.body>, Product>
{
  constructor(
    private readonly createProductRepository: CreateProductRepository,
    private readonly createMovementRepository: CreateMovementsRepository,
    private readonly createProductSupplierRepository: UpsertProductSupplierRepository,
    private readonly createProductCategoryRepository: UpsertProductCategoryRepository,
    private readonly productImageStorageAdapter: ProductImageStorage,
  ) {}

  async exec(input: z.infer<typeof requestSchema.shape.body>) {
    const productId = randomUUID();

    const productDTO = {
      id: productId,
      name: input.name,
      userId: input.userId,
      unitPrice: input.unitPrice,
      suppliersIds: input.suppliersIds,
      stockQuantity: input.stockQuantity,
      categoriesIds: input.categoriesIds,
      image: input.image
        ? await this.productImageStorageAdapter.uploadFile(
            input.image,
            `${input.userId}/${productId}.jpg`,
          )
        : null,
      nameNormalized: normalizeName(input.name),
      description: input.description ?? null,
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
    });

    console.log('movement created');

    if (productDTO.suppliersIds) {
      console.log('creating productSupplier...');

      await this.createProductSupplierRepository.exec(
        productDTO.suppliersIds.map(supplierId => ({
          productId: product.id,
          supplierId,
        })),
      );
    }

    if (productDTO.categoriesIds) {
      console.log('creating productCategory...');

      await this.createProductCategoryRepository.exec(
        productDTO.categoriesIds.map(categoryId => ({
          productId: product.id,
          categoryId,
        })),
      );
    }

    return product;
  }
}
