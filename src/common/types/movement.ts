import {Movement, Prisma} from '@prisma/client';

export type TCreateMovementInput = Omit<
  Movement,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export interface IListMovementsRepositoryInput {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  orderBy?: Prisma.SortOrder;
  userId: string;
  skip?: number;
  productsIds?: string[];
  productName?: string;
}

export interface IListMovementsRepositoryOutput {
  movements: (Movement & {productImage?: string | null})[];
  count: number;
  totalPages: number;
}

export type TListMovementsInputUseCase = IListMovementsRepositoryInput;
