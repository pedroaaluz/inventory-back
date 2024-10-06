import {UseCase} from '../../../../common/interfaces';
import {CreateMovementsRepository} from '../../../../common/repositories/movement/createMovementRepository';
import {UpdateProductRepository} from '../../../../common/repositories/product/updateProductRepository';
import {TCreateMovementInput} from '../../../../common/types/movement';
import {TUpdateProductInput} from '../../../../common/types/product';
import {GetProductRepository} from '../../../../common/repositories/product/getProductRepository';
import {NotFound} from 'http-errors';
import {normalizeName} from '../../../../common/string/normalize';
import {Product} from '@prisma/client';
import {ProductImageStorage} from '../../../../common/infrastructure/productImageStorage';

export class UpdateProductUseCase
  implements UseCase<TUpdateProductInput, Product>
{
  constructor(
    private readonly UpdateProductRepository: UpdateProductRepository,
    private readonly GetProductRepository: GetProductRepository,
    private readonly CreateNewMovementRepository: CreateMovementsRepository,
    private readonly productImageStorageAdapter: ProductImageStorage,
  ) {}

  async exec(input: TUpdateProductInput) {
    const productDTO: TUpdateProductInput = {
      id: input.id,
      userId: input.userId,
      name: input.name,
      image: input.image
        ? await this.productImageStorageAdapter.uploadFile(
            input.image,
            `${input.userId}/${input.id}.jpg`,
          )
        : undefined,
      unitPrice: input.unitPrice,
      supplierId: input.supplierId,
      description: input.description,
      stockQuantity: input.stockQuantity,
      categoryId: input.categoryId,
      expirationDate: input.expirationDate
        ? new Date(input.expirationDate)
        : null,
      nameNormalized: input.name ? normalizeName(input.name) : undefined,
    };

    console.log('ProductDTO', productDTO);

    const getProductResult = await this.GetProductRepository.exec(
      productDTO.id,
    );

    if (!getProductResult) {
      throw new NotFound('Product not found');
    }

    if (getProductResult.product.userId !== productDTO.userId) {
      throw new NotFound('Product not found');
    }

    const {stockQuantity: currentStockQuantity} = getProductResult.product;

    if (
      productDTO.stockQuantity !== currentStockQuantity &&
      productDTO.stockQuantity
    ) {
      console.log('Creating new movement...');

      const movementDTO: TCreateMovementInput = {
        movementType:
          currentStockQuantity > productDTO.stockQuantity
            ? 'REMOVE_FROM_STOCK'
            : 'ADD_TO_STOCK',
        productId: productDTO.id,
        userId: productDTO.userId,
        quantity: productDTO.stockQuantity,
        movementValue: null,
        paymentMethod: null,
        productName: productDTO.name
          ? productDTO.name
          : getProductResult.product.name,
        productNameNormalized: productDTO.nameNormalized
          ? productDTO.nameNormalized
          : getProductResult.product.nameNormalized,
      };

      await this.CreateNewMovementRepository.exec(movementDTO);
    }

    const [productUpdated] = await this.UpdateProductRepository.exec(
      productDTO,
    );

    console.log('Updated Product');

    return productUpdated;
  }
}
