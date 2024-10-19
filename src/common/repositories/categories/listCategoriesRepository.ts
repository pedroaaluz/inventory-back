import type {PrismaClient, Prisma} from '@prisma/client';
import {Repository} from '../../interfaces';
import type {
  TListCategoriesOutput,
  TListCategoryInput,
} from '../../types/category';

export class ListCategoriesRepository
  implements Repository<TListCategoryInput, TListCategoriesOutput>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(filterInput: TListCategoryInput) {
    try {
      const {name} = filterInput;

      const where: Prisma.CategoryWhereInput[] = [];

      if (name) {
        where.push({
          name: {
            contains: name,
          },
        });
      }

      console.log('Where clauses', where);

      const categories = await this.dbClient.category.findMany({
        where: {
          AND: where,
        },
      });

      console.log('query finished');

      return {
        categories,
      };
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
