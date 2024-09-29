import {Prisma, Supplier} from '@prisma/client';

export type CreateSupplierInput = {
  id: string;
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
  orderBy: Prisma.SortOrder;
  startDate: string;
  endDate: string;
  page: number;
  pageSize: number;
  suppliersIds: string[] | undefined;
  skip: number;
  userId: string;
  name: string | undefined;
};

export interface IListSuppliersOutput {
  suppliers: Supplier[];
  count: number;
  totalPages: number;
}
