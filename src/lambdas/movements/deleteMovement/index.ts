import {MakeDeleteMovementController} from './factories/makeDeleteMovementController';
import {HttpFn} from '../../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from './schema';
import {z} from 'zod';
import handler from '../../../common/middlewares/handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import {zodValidatorMiddleware} from '../../../common/middlewares/zodValidator';
import httpResponseStringify from '../../../common/middlewares/httpResponseStringify';

/**
 * @invoke sls invoke local -f DeleteMovement -p src/lambdas/movements/deleteMovement/mock.json
 */

const fn: HttpFn<
  //need to recieve and id from path parameters and return a responseSchema

  z.infer<typeof requestSchema>,
  | z.infer<(typeof responseSchema)['200']>
  | z.infer<(typeof responseSchema)['404']>
> = async event => {
  try {
    const controller = MakeDeleteMovementController();
    const response = await controller.exec(event);

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const bootstrap = handler(fn, [
  httpEventNormalizer(),
  zodValidatorMiddleware({requestSchema}),
  httpResponseStringify(),
  httpErrorHandler(),
]);
