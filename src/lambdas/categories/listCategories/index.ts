import {makeListCategoriesController} from './factories/makeListCategoriesController';
import httpEventNormalizer from '@middy/http-event-normalizer';
import {zodValidatorMiddleware} from '../../../common/middlewares/zodValidator';
import httpErrorHandler from '@middy/http-error-handler';
import handler from '../../../common/middlewares/handler';
import {requestSchema, responseSchema} from './schema';
import {HttpFn} from '../../../common/types/lambdasTypes';
import {z} from 'zod';
import httpResponseStringify from '../../../common/middlewares/httpResponseStringify';

/**
 * @description This lambda function is responsible for listing categories. It uses the provided event to execute the controller logic
 * and returns the response.
 * @invoke sls invoke local -f ListCategories -p src/lambdas/categories/listCategories/mock.json
 */

const fn: HttpFn<
  z.infer<typeof requestSchema>,
  z.infer<(typeof responseSchema)['200']>
> = async event => {
  try {
    const controller = makeListCategoriesController();
    const response = await controller.exec(event);

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const bootstrap = handler(fn, [
  httpEventNormalizer(),
  zodValidatorMiddleware({
    requestSchema,
  }),
  httpResponseStringify(),
  httpErrorHandler({logger: console.error}),
]);
