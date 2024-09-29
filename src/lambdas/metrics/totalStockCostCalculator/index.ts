import {makeTotalStockCostCalculatorController} from './factories/makeTotalStockCostCalculator';
import {HttpFn} from '../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from './schema';
import {z} from 'zod';
import handler from '../../../common/middlewares/handler';
import {zodValidatorMiddleware} from '../../../common/middlewares/zodValidator';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import httpBodyNormalize from '../../../common/middlewares/httpBodyNormalize';
import httpResponseStringify from '../../../common/middlewares/httpResponseStringify';

/**
 * @description Lambda function to calculate the total stock cost.
 * @invoke sls invoke local -f TotalStockCostCalculator -p src/lambdas/metrics/totalStockCostCalculator/mock.json
 */

const fn: HttpFn<
  z.infer<typeof requestSchema>,
  z.infer<(typeof responseSchema)['200']>
> = async event => {
  try {
    const controller = makeTotalStockCostCalculatorController();

    const response = await controller.exec(event);

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const bootstrap = handler(fn, [
  httpEventNormalizer(),
  httpBodyNormalize(),
  zodValidatorMiddleware({requestSchema}),
  httpErrorHandler(),
  httpResponseStringify(),
]);
