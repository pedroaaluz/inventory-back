import {makeUpdateSupplierController} from './factories/makeUpdateSupplier';
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
 * @description Lambda responsible for updating an existing supplier's details, including its supplier, category,
 * and managing any necessary stock movements.
 * @invoke sls invoke local -f UpdateSupplier -p src/lambdas/suppliers/updateSupplier/mock.json
 */

const fn: HttpFn<
  z.infer<typeof requestSchema>,
  z.infer<(typeof responseSchema)['200']>
> = async event => {
  try {
    const controller = makeUpdateSupplierController();

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
