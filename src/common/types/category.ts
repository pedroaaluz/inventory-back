import {Category} from '@prisma/client';

export type TListCategoriesOutput = {
  categories: Category[];
};

export type TListCategoryInput = {
  name?: string;
};
