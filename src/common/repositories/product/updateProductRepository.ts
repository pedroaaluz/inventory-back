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
        if (product[key as keyof TUpdateProductInput]) {
          columns.add(key);
        }
      });
    });

    const setClause = [...columns].reduce<string[]>((acc, col) => {
      if (
        col !== 'id' &&
        col !== 'userId' &&
        productDTO.some(product => product[col as keyof TUpdateProductInput])
      ) {
        acc.push(`"${col}" = t."${col}"`);
      }
      return acc;
    }, []);

    const queryValues = productDTO.reduce<string[]>((acc, product) => {
      const values = Object.values(product)
        .filter(v => v !== null && v !== undefined)
        .map(v => (typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v));

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
