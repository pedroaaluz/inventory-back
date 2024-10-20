import type {PrismaClient, Product} from '@prisma/client';
import {Repository} from '../../interfaces';
import {TUpdateProductInput} from '../../types/product';

export class UpdateProductRepository
  implements Repository<TUpdateProductInput, Product[]>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(
    productDTO: TUpdateProductInput | TUpdateProductInput[],
  ): Promise<Product[]> {
    if (!Array.isArray(productDTO)) {
      productDTO = [productDTO];
    }

    if (productDTO.length === 0) {
      return [];
    }

    const columns = new Set<string>();

    productDTO.forEach((product: TUpdateProductInput) => {
      Object.keys(product).forEach(key => {
        if (
          product[key as keyof TUpdateProductInput] &&
          !['categoriesIds', 'suppliersIds'].includes(key)
        ) {
          columns.add(key);
        }
      });
    });

    const setClause = [...columns].reduce<string[]>(
      (acc, col) => {
        if (
          !['suppliersIds', 'id', 'userId', 'categoriesIds'].includes(col) &&
          productDTO.some(product => product[col as keyof TUpdateProductInput])
        ) {
          acc.push(`"${col}" = t."${col}"`);
        }
        return acc;
      },
      [`"updatedAt" = NOW()`],
    );

    const queryValues = productDTO.reduce<string[]>((acc, product) => {
      const values = Object.entries(product)
        .filter(
          ([key, value]) =>
            value !== null &&
            value !== undefined &&
            !['categoriesIds', 'suppliersIds'].includes(key),
        )
        .map(([_key, value]) =>
          typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value,
        );

      if (values.length > 0) {
        acc.push(`(${values.join(', ')})`);
      }

      return acc;
    }, []);

    const query = `
      WITH t (${[...columns].map(col => `"${col}"`).join(', ')}) AS (
        VALUES 
          ${queryValues.join(',')}
      )
      UPDATE "Product" p
      SET 
        ${setClause.join(', ')}
      FROM t
      WHERE p.id = t.id AND p."userId" = t."userId"
      RETURNING p.*;
    `;

    console.log('Query:', query);

    try {
      const updatedProducts = await this.dbClient.$queryRawUnsafe<Product[]>(
        query,
      );
      return updatedProducts;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
}
