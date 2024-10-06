import type {PrismaClient, Supplier} from '@prisma/client';
import {Repository} from '../../interfaces';
import {IUpdateSupplierInput} from '../../types/supplier';

export class UpdateSupplierRepository
  implements Repository<IUpdateSupplierInput, Supplier[]>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(
    supplierDTO: IUpdateSupplierInput | IUpdateSupplierInput[],
  ): Promise<Supplier[]> {
    if (!Array.isArray(supplierDTO)) {
      supplierDTO = [supplierDTO];
    }

    if (supplierDTO.length === 0) {
      return [];
    }

    const columns = new Set<string>();

    supplierDTO.forEach((supplier: IUpdateSupplierInput) => {
      Object.keys(supplier).forEach(key => {
        if (supplier[key as keyof IUpdateSupplierInput]) {
          columns.add(key);
        }
      });
    });

    const setClause = [...columns].reduce<string[]>((acc, col) => {
      if (
        col !== 'id' &&
        col !== 'userId' &&
        supplierDTO.some(
          supplier => supplier[col as keyof IUpdateSupplierInput],
        )
      ) {
        acc.push(`"${col}" = t."${col}"`);
      }
      return acc;
    }, []);

    const queryValues = supplierDTO.reduce<string[]>((acc, supplier) => {
      const values = Object.values(supplier)
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
      UPDATE "Supplier" s
      SET 
        ${setClause.join(', ')}
      FROM t
      WHERE s.id = t.id AND s."userId" = t."userId"
      RETURNING s.*;
    `;

    console.log('Query:', query);

    try {
      const updatedSuppliers = await this.dbClient.$queryRawUnsafe<Supplier[]>(
        query,
      );
      return updatedSuppliers;
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  }
}
