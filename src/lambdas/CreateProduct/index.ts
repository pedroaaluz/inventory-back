import {makeCreateNewProductController} from './factories/MakeCreateNewProduct';
import {HttpFn} from '../../common/types/lambdasTypes';
import {requestSchema, responseSchema} from './schema';
import {z} from 'zod';
import handler from '../../common/middlewares/handler';
import {zodValidatorMiddleware} from '../../common/middlewares/zodValidator';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpPartialResponse from '@middy/http-partial-response';
import httpBodyNormalize from '../../common/middlewares/httpBodyNormalize';

const fn: HttpFn<
  z.infer<typeof requestSchema>,
  z.infer<(typeof responseSchema)['200']>
> = async event => {
  try {
    const controller = makeCreateNewProductController();

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
  zodValidatorMiddleware({requestSchema, responseSchema}),
  httpPartialResponse(),
]);
