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
    productDTO.forEach(product => {
      Object.keys(product).forEach(key => columns.add(key));
    });

    const setClause = [...columns].reduce<string[]>((acc, col) => {
      if (col !== 'id' && col !== 'userId') {
        acc.push(`"${col}" = t."${col}"`);
      }
      return acc;
    }, []);

    const queryValues = productDTO.map(product => {
      const values = Object.values(product).map(v =>
        typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v,
      );
      return `(${values.join(', ')})`;
    });

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
