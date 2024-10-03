import {UseCase} from '../../../../common/interfaces';
import {PaymentMethodUsedRepository} from '../../../../common/repositories/metrics/paymentMethodUsedRepository';
import {
  TPaymentMethodUsedInputUseCase,
  IPaymentMethodUsedRepositoryOutput,
} from '../../../../common/types/metrics';

export class PaymentMethodUsedUseCase
  implements
    UseCase<TPaymentMethodUsedInputUseCase, IPaymentMethodUsedRepositoryOutput>
{
  constructor(
    private readonly paymentMethodUsedRepository: PaymentMethodUsedRepository,
  ) {}

  async exec(input: TPaymentMethodUsedInputUseCase) {
    try {
      console.log('Filters from request', input);

      const paymentMethodUsedFilterDTO = {
        userId: input.userId,
        startDate: input.startDate,
        endDate: input.endDate,
      };

      const paymentMethodUsed = await this.paymentMethodUsedRepository.exec(
        paymentMethodUsedFilterDTO,
      );

      return paymentMethodUsed;
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
