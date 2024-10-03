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
