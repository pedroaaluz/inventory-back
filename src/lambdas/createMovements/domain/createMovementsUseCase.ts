import {UseCase} from '../../../common/interfaces';
import {EnumMovementsType, Prisma} from '@prisma/client';
import {z} from 'zod';
import {CreateMovementsRepository} from '../../../common/repositories/movement/createMovementRepository';
import {requestSchema} from '../schema';
import {ListProductsRepository} from '../../../common/repositories/product/listProductsRepository';
import {TCreateMovementInput} from '../../../common/types/movement';
import {UpdateProductRepository} from '../../../common/repositories/product/updateProductRepository';

export interface ICreateMovementsUseCaseOutput {
  movementsCreated: {
    productId: string;
    quantity: number;
    movementType: EnumMovementsType;
    movementValue: Prisma.Decimal | null;
    paymentMethod: string | null;
  }[];
  movementsInvalid: {
    productId: string;
    movementType: string;
    quantity: number;
    quantityCurrent: number;
    movementValue?: Prisma.Decimal;
    message: string;
  }[];
}

export class CreateMovementsUseCase
  implements
    UseCase<
      z.infer<typeof requestSchema.shape.body> & {userId: string},
      ICreateMovementsUseCaseOutput
    >
{
  constructor(
    private readonly createMovementRepository: CreateMovementsRepository,
    private readonly listProductsRepository: ListProductsRepository,
    private readonly updateProductRepository: UpdateProductRepository,
  ) {}

  async exec(
    input: z.infer<typeof requestSchema.shape.body> & {userId: string},
  ) {
    const productsIds = input.movements.map(movement => movement.productId);
    const userId = input.userId;

    const {products} = await this.listProductsRepository.exec({
      userId,
      productsIds,
    });

    const movementsDTO = input.movements.reduce<{
      movementsInvalid: {
        productId: string;
        movementType: string;
        quantity: number;
        quantityCurrent: number;
        movementValue?: Prisma.Decimal;
        message: string;
      }[];
      movementsToCreate: TCreateMovementInput[];
      productToUpdate: {id: string; stockQuantity: number; userId: string}[];
    }>(
      (acc, movement) => {
        const product = products.find(p => p.id === movement.productId);

        if (!product) {
          acc.movementsInvalid.push({
            productId: movement.productId,
            quantity: movement.quantity,
            movementType: movement.type,
            quantityCurrent: 0,
            message: 'Product not found',
          });

          return acc;
        }

        if (
          product?.stockQuantity < movement.quantity &&
          (movement.type === EnumMovementsType.SALE ||
            movement.type === EnumMovementsType.REMOVE_FROM_STOCK)
        ) {
          acc.movementsInvalid.push({
            productId: movement.productId,
            quantity: movement.quantity,
            quantityCurrent: product.stockQuantity,
            movementType: movement.type,
            movementValue: movement.cost,
            message: 'Insufficient stock',
          });

          return acc;
        }

        acc.movementsToCreate.push({
          productId: movement.productId,
          quantity: movement.quantity,
          userId,
          movementType: movement.type,
          productName: product.name,
          productNameNormalized: product.nameNormalized,
          movementValue: movement.cost || null,
          paymentMethod: movement.paymentMethod || null,
        });

        acc.productToUpdate.push({
          id: movement.productId,
          stockQuantity:
            movement.type === EnumMovementsType.ADD_TO_STOCK
              ? product.stockQuantity + movement.quantity
              : product.stockQuantity - movement.quantity,
          userId,
        });

        return acc;
      },
      {
        movementsInvalid: [],
        movementsToCreate: [],
        productToUpdate: [],
      },
    );

    if (movementsDTO.movementsToCreate.length > 0) {
      await Promise.all([
        (movementsDTO.productToUpdate.length > 0 &&
          this.updateProductRepository.exec(movementsDTO.productToUpdate)) ||
          [],
        this.createMovementRepository.exec(movementsDTO.movementsToCreate),
      ]);
    }

    return {
      movementsCreated: movementsDTO.movementsToCreate.map(movement => ({
        productId: movement.productId,
        quantity: movement.quantity,
        movementType: movement.movementType,
        movementValue: movement.movementValue,
        paymentMethod: movement.paymentMethod,
      })),
      movementsInvalid: movementsDTO.movementsInvalid,
    };
  }
}
