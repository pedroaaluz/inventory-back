import type {Product, Category, Supplier} from '@prisma/client';
import {Decimal} from '@prisma/client/runtime';

export type TGetProductInput = {
  productId: string;
};

export type TProduct = {
  id: number;
  name: string;
  description?: string;
  userId: string;
  stockQuantity: number;
  unitPrice: Decimal;
  expirationDate?: Date;
  created_at: Date;
  deleted_at: Date;
};

export type TGetProductOutput = Product & {
  categories: Category[];
  suppliers: Supplier[];
};

export type TUpdateProductInput = {
  id: string;
  name: string;
  description?: string;
  stockQuantity: number;
  unitPrice: number;
  expirationDate?: Date;
  userId: string;
  supplierId: number;
  categoryId: number;
  image?: string;
};

export type TCreateProductInput = Omit<
  Product,
  'createdAt' | 'updatedAt' | 'deletedAt' | 'id'
> & {supplierId: string; categoryId: string};

export type TListProductsInput = {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  userId: string;
  orderBy?: string;
  categories?: number[];
  suppliers?: number[];
  skip?: number;
};

export type TListProductsOutput = {
  products: TProduct[];
  count: number;
  totalPages: number;
};

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
