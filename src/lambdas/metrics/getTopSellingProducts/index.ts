import {makeGetTopSellingProducts} from './factories/makeGetTopSellingProducts';
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
 * @description Lambda function to get top selling products.
 * @invoke sls invoke local -f GetTopSellingProducts -p src/lambdas/metrics/getTopSellingProducts/mock.json
 */

const fn: HttpFn<
  z.infer<typeof requestSchema>,
  z.infer<(typeof responseSchema)['200']>
> = async event => {
  try {
    const controller = makeGetTopSellingProducts();

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
