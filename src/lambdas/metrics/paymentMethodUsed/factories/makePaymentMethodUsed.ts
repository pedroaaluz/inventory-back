import {prisma} from '../../../../../prisma/prismaClient';
import {PaymentMethodUsedRepository} from '../../../../common/repositories/metrics/paymentMethodUsedRepository';
import {PaymentMethodUsedUseCase} from '../domain/paymentMethodUsedUseCase';
import {PaymentMethodUsedController} from '../ports/controller/paymentMethodUsedController';

export function makePaymentMethodUsed() {
  const dbClient = prisma;

  const paymentMethodUsedRepository = new PaymentMethodUsedRepository(dbClient);

  const paymentMethodUsedUseCase = new PaymentMethodUsedUseCase(
    paymentMethodUsedRepository,
  );

  const paymentMethodUsedController = new PaymentMethodUsedController(
    paymentMethodUsedUseCase,
  );

  return paymentMethodUsedController;
}
