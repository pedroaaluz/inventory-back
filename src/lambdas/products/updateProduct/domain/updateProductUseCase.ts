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
import {DeleteProductCategoryRepository} from '../../../../common/repositories/productCategory/deleteProductCategoryRepository';
import {DeleteProductSupplierRepository} from '../../../../common/repositories/productSupplier/deleteProductSupplierRepository';
import {UpsertProductCategoryRepository} from '../../../../common/repositories/productCategory/upsertProductCategoryRepository';
import {UpsertProductSupplierRepository} from '../../../../common/repositories/productSupplier/upsertProductSupplierRepository';

export class UpdateProductUseCase
  implements UseCase<TUpdateProductInput, Product>
{
  constructor(
    private readonly updateProductRepository: UpdateProductRepository,
    private readonly getProductRepository: GetProductRepository,
    private readonly createNewMovementRepository: CreateMovementsRepository,
    private readonly deleteProductCategoryRepository: DeleteProductCategoryRepository,
    private readonly deleteProductSupplierRepository: DeleteProductSupplierRepository,
    private readonly upsertProductCategoryRepository: UpsertProductCategoryRepository,
    private readonly upsertProductSupplierRepository: UpsertProductSupplierRepository,
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
      suppliersIds: input.categoriesIds,
      description: input.description,
      stockQuantity: input.stockQuantity,
      categoriesIds: input.suppliersIds,
      expirationDate: input.expirationDate
        ? new Date(input.expirationDate)
        : null,
      nameNormalized: input.name ? normalizeName(input.name) : undefined,
    };

    console.log('ProductDTO', productDTO);

    const getProductResult = await this.getProductRepository.exec(
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

      await this.createNewMovementRepository.exec(movementDTO);
    }

    if (productDTO.categoriesIds) {
      console.log('Upserting product categories...');

      await this.deleteProductCategoryRepository.exec({
        productId: productDTO.id,
        categoriesIds: getProductResult.categories
          .filter(category => productDTO.categoriesIds?.includes(category.id))
          .map(category => category.id),
      });

      await this.upsertProductCategoryRepository.exec(
        productDTO.categoriesIds.map(categoryId => ({
          productId: productDTO.id,
          categoryId,
        })),
      );
    }

    if (productDTO.suppliersIds) {
      console.log('Upserting product suppliers...');

      await this.deleteProductSupplierRepository.exec({
        productId: productDTO.id,
        suppliersIds: getProductResult.suppliers
          .filter(supplier => productDTO.suppliersIds?.includes(supplier.id))
          .map(supplier => supplier.id),
      });

      await this.upsertProductSupplierRepository.exec(
        productDTO.suppliersIds.map(supplierId => ({
          productId: productDTO.id,
          supplierId,
        })),
      );
    }

    const [productUpdated] = await this.updateProductRepository.exec(
      productDTO,
    );

    console.log('Updated Product');

    return productUpdated;
  }
}
