import {Controller} from '../../../../../common/interfaces';
import {PaymentMethodUsedUseCase} from '../../domain/paymentMethodUsedUseCase';
import {
  HttpEvent,
  HttpResponse,
} from '../../../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from '../../schema';
import {z} from 'zod';
import {format} from 'date-fns';

export class PaymentMethodUsedController
  implements
    Controller<
      HttpEvent<z.infer<typeof requestSchema>>,
      Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>>
    >
{
  constructor(
    private readonly paymentMethodUsedUseCase: PaymentMethodUsedUseCase,
  ) {}

  async exec(
    event: HttpEvent<z.infer<typeof requestSchema>>,
  ): Promise<HttpResponse<z.infer<(typeof responseSchema)['200']>>> {
    const {userId} = event.pathParameters;
    const {startDate, endDate} = event.queryStringParameters || {};

    const today = new Date();
    const sevenDaysAgo = today.setDate(today.getDate() - 7);
    const paymentMethodUsed = await this.paymentMethodUsedUseCase.exec({
      userId,
      startDate: startDate || format(sevenDaysAgo, 'yyyy-MM-dd HH:mm:ss'),
      endDate: endDate || format(today, 'yyyy-MM-dd HH:mm:ss'),
    });

    return {
      statusCode: 200,
      body: {
        paymentMethodUsed,
        message: 'Payment method used listed successfully',
      },
    };
  }
}
