export type EnumPaymentMethodTranslatedType =
  | 'creditCard'
  | 'debitCard'
  | 'cash'
  | 'pix';

export interface IPaymentMethodUsedRepositoryOutput {
  creditCard: number;
  debitCard: number;
  cash: number;
  pix: number;
}

export interface TPaymentMethodUsedInputUseCase {
  userId: string;
  startDate: string;
  endDate: string;
}

export interface TGetTopSellingProductsInputUseCase {
  userId: string;
  startDate: string;
  endDate: string;
  page: number;
  pageSize: number;
}

export interface TGetStockMetricsInputUseCase {
  userId: string;
  startDate: string;
  endDate: string;
  productName?: string;
}

export interface IGetStockMetricsOutput {
  products: {
    id: string;
    name: string;
    image: string | null;
    totalSales: number;
    stockQuantity: number;
    averageConsumption: number;
    stockCoverage: number;
    turnoverRate: number;
  }[];
}

export interface IGetTopSellingProductsOutput {
  products: {
    count: number;
    productName: string;
    productImage: string | null;
    stockQuantity: number;
    productId: string;
  }[];
}
