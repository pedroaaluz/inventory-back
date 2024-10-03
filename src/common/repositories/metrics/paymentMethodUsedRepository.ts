import type {EnumPaymentMethodType, PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';
import {EnumPaymentMethodTranslatedType} from '../../types/metrics';

export class PaymentMethodUsedRepository
  implements
    Repository<
      {userId: string; startDate: string; endDate: string},
      Record<EnumPaymentMethodTranslatedType, number>
    >
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec({
    userId,
    startDate,
    endDate,
  }: {
    userId: string;
    startDate: string;
    endDate: string;
  }) {
    try {
      const paymentMethodUsed = await this.dbClient.movement.groupBy({
        by: ['paymentMethod'],
        where: {
          movementType: 'SALE',
          userId,
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        _count: true,
      });

      console.log('paymentMethodUsed', paymentMethodUsed);

      const paymentMethodDictionary: Record<
        EnumPaymentMethodType,
        EnumPaymentMethodTranslatedType
      > = {
        CREDIT: 'creditCard',
        DEBIT: 'debitCard',
        CASH: 'cash',
        PIX: 'pix',
      };

      const aggregatedPaymentMethodUsed = paymentMethodUsed.reduce<{
        creditCard: number;
        debitCard: number;
        cash: number;
        pix: number;
      }>(
        (acc, curr) => {
          if (curr.paymentMethod === null) return acc;

          const paymentMethodTranslated =
            paymentMethodDictionary[curr.paymentMethod];

          acc[paymentMethodTranslated] = curr._count;

          return acc;
        },
        {
          creditCard: 0,
          debitCard: 0,
          cash: 0,
          pix: 0,
        },
      );

      return aggregatedPaymentMethodUsed;
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
