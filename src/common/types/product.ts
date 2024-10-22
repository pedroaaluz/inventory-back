import type {Product, Category, Supplier} from '@prisma/client';
import {Prisma} from '@prisma/client';

export type TGetProductInput = {
  productId: string;
};

export type TGetProductOutput = Product & {
  categories: Category[];
  suppliers: Supplier[];
};

export type TUpdateProductInput = {
  id: string;
  name?: string;
  description?: string;
  stockQuantity?: number;
  unitPrice?: Prisma.Decimal;
  expirationDate?: Date | null;
  suppliersIds?: string[];
  categoriesIds?: string[];
  image?: string;
  nameNormalized?: string;
  userId: string;
  minimumIdealStock?: number;
  positionInStock?: string;
  productionCost?: Prisma.Decimal;
};

export type TCreateProductInput = Omit<
  Product,
  'createdAt' | 'updatedAt' | 'deletedAt' | 'id' | 'expirationDate'
>;

export type TListProductsInput = {
  orderBy?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  categoriesIds?: string[] | undefined;
  suppliersIds?: string[] | undefined;
  productsIds?: string[] | undefined;
  skip?: number;
  userId: string;
  name?: string | undefined;
};

export interface IListProductsOutput {
  products: (Product & {
    suppliers: Pick<Supplier, 'name' | 'id' | 'nameNormalized'>[];
    categories: Pick<Category, 'name' | 'id'>[];
  })[];
  count: number;
  totalPages: number;
}

type TSalesHistory = {
  movementId: number;
  movementType: string;
  quantity: number;
  paymentMethod: string;
  sellDate: Date;
};

export type TProductsFinancialStatisticsOutput = {
  name: string;
  id: number;
  supplierName: string;
  salesHistory: TSalesHistory[];
  totalSales: number;
  creditSales: number;
  pixSales: number;
  debitSales: number;
  cashSales: number;
};

export type TProductStatisticsInput = {
  userId: string;
  products?: string[];
  startDate?: string;
  endDate?: string;
  limit?: number;
};

type TMovementsHistory = {
  movementId: number;
  movementType: string;
  quantity: number;
  date: string;
};

export type TProductsMovementsHistoryOutput = {
  id: number;
  name: string;
  movementsHistory: TMovementsHistory[];
};

type JoinTypes = Omit<TProductsMovementsHistoryOutput, 'id' | 'name'> &
  Omit<TProductsFinancialStatisticsOutput, 'id' | 'name' | 'supplierName'>;

export type TProductStatisticsOutput = {
  name: string;
  id: number;
  supplierName: string;
} & JoinTypes;
