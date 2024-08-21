import middy from '@middy/core';

import type {
  Callback as LambdaCallback,
  Context as LambdaContext,
} from 'aws-lambda';

export default function handler<
  Event = any,
  Context extends LambdaContext = LambdaContext | undefined,
  Callback extends LambdaCallback = LambdaCallback | undefined,
>(
  fun: (
    event: Event,
    context: Context,
    callback: Callback,
  ) => void | Promise<unknown>,
  middlewares: Array<middy.MiddlewareObj<any>>,
) {
  const fn = middy<Event, unknown, Error, Context>(fun);

  middlewares.forEach(middleware => {
    fn.use(middleware);
  });

  return fn;
}
