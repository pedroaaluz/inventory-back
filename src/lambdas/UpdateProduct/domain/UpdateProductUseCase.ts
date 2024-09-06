import {UseCase} from '../../../common/interfaces';
import {GetProductRepository} from '../../../common/repositories/product/getProductRepository'; 
import {UpdateProductRepository} from '../ports/repositories/UpdateProductRepository';
import type {Product} from '@prisma/client';
import {z} from 'zod';
import { requestSchema } from '../schema';

export class UpdateProductUseCase
  implements
    UseCase<
    z.infer<typeof requestSchema>,
    {product: Product; supplierId: string[]; category: string[]} | null
    >
    {
      constructor(private readonly updateProductRepository: UpdateProductRepository) {}

      async exec(input: z.infer<typeof requestSchema>) {
        try{
          const productId  = input.body.id;

          if(productId == null){
            return {
              statusCode: 400,
              body: {
                message: 'Id do produto a ser atualizado não informado',
              },
            };
          }

          const productUpdate = await this.updateProductRepository.exec(input.body);

          return {
            statusCode: 200,
            body: {
              product: {
                id: productUpdate.product.id,
                name: productUpdate.product.name,
                categoryId: productUpdate.category || [],
                supplierId: productUpdate.supplierId || [],
                image: productUpdate.product.image,
                description: productUpdate.product.description,
                stockQuantity: productUpdate.product.stockQuantity,
                unitPrice: Number(productUpdate.product.unitPrice),
                positionInStock: productUpdate.product.positionInStock,
                expirationDate: productUpdate.product.expirationDate,
                createdAt: productUpdate.product.createdAt,
                deletedAt: productUpdate.product.deletedAt,
                updatedAt: productUpdate.product.updatedAt,
              },
            },
          };
        }catch(error){
          return {
            statusCode: 500,
            body: {
              message: 'Erro interno',
            },
          };
        }
      }

    }
// import {UseCase} from '../../../common/interfaces';
// import {CreateMovementRepository} from '../../../common/repositories/movement/createMovementRepository';
// //import {MovementsInput} from '../../../common/types/movement';
// import {TProduct, TUpdateProductInput} from '../../../common/types/product';
// import {GetProductRepository} from '../../../common/repositories/product/getProductRepository';
// import {UpdateProductRepository} from '../ports/repositories/UpdateProductRepository';

// export class UpdateProductUseCase
//   implements UseCase<TUpdateProductInput, TProduct>
// {
//   constructor(
//     private readonly UpdateProductRepository: UpdateProductRepository,
//     private readonly GetProductRepository: GetProductRepository,
//     private readonly CreateNewMovementRepository: CreateMovementRepository,
//   ) {}

//   async exec(input: TUpdateProductInput) {
//     const productDTO: TUpdateProductInput = {
//       id: input.id,
//       userId: input.userId,
//       name: input.name,
//       image: input.image,
//       unitPrice: input.unitPrice,
//       supplierId: input.supplierId,
//       description: input.description,
//       stockQuantity: input.stockQuantity,
//       categoryId: input.categoryId,
//       expirationDate: input.expirationDate && new Date(input.expirationDate),
//     };

//     console.log('ProductDTO', productDTO);

//     const {stockQuantity: currentStockQuantity} =
//       await this.GetProductRepository.exec({
//         productId: productDTO.id,
//       });

//     if (productDTO.stockQuantity !== currentStockQuantity) {
//       console.log('Creating new movement...');

//       const movementDTO: MovementsInput = {
//         movementType:
//           currentStockQuantity > productDTO.stockQuantity
//             ? 'REMOVE_FROM_STOCK'
//             : 'ADD_TO_STOCK',
//         productId:
//           typeof productDTO.id === 'string'
//             ? Number(productDTO.id)
//             : productDTO.id,
//         userId: productDTO.userId,
//         quantity: productDTO.stockQuantity,
//       };

//       await this.CreateNewMovementRepository.exec(movementDTO);
//     }

//     const product = await this.UpdateProductRepository.exec(productDTO);

//     console.log('Updated Product', product);

//     return product;
//   }
// }
