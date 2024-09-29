import {MakeGetSupplierController} from './factories/makeGetSupplier';
import {HttpFn} from '../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from './schema';
import {z} from 'zod';
import handler from '../../common/middlewares/handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import {zodValidatorMiddleware} from '../../common/middlewares/zodValidator';

/**
 * @description Lambda responsible for getting a supplier by its id.
 * @invoke sls invoke local -f GetSupplier -p src/lambdas/supplier/mock.json
 */

const fn: HttpFn<
  z.infer<typeof requestSchema>,
  | z.infer<(typeof responseSchema)['200']>
  | z.infer<(typeof responseSchema)['404']>
> = async event => {
  try {
    const controller = MakeGetSupplierController();
    const response = await controller.exec(event);

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const bootstrap = handler(fn, [
  httpEventNormalizer(),
  zodValidatorMiddleware({requestSchema, responseSchema}),
  httpErrorHandler(),
]);
