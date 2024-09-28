export type CreateSupplierInput = {
  name: string;
  normalizeName: string;
  userId: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  cnpj?: string | null;
  image?: string | null;
};

export type TListSuppliersInput = {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  products?: number[];
  orderBy?: string;
  skip?: number;
};

export type TSuppliersStatisticsInput = {
  userId: string;
  suppliers?: string[];
  startDate?: string;
  endDate?: string;
  limit?: number;
};

type salesHistory = {
  productId: number;
  movementId: number;
  paymentMethod: string;
  quantity: number;
  sellDate: Date;
};

export type TSuppliersFinancialStatisticsOutput = {
  id: number;
  name: string;
  salesHistory: salesHistory[];
  totalSales: bigint;
  creditSales: bigint;
  pixSales: bigint;
  debitSales: bigint;
  cashSales: bigint;
};

type TMovementsHistory = {
  productId: number;
  movementId: number;
  movementType: string;
  quantity: number;
  date: string;
};

export type TSuppliersMovementsHistoryOutput = {
  id: number;
  name: string;
  movementsHistory: TMovementsHistory[];
};

type JoinTypes = Omit<TSuppliersMovementsHistoryOutput, 'id' | 'name'> &
  Omit<TSuppliersFinancialStatisticsOutput, 'id' | 'name'>;

export type TSuppliersStatisticsOutput = {
  name: string;
  id: number;
} & JoinTypes;
