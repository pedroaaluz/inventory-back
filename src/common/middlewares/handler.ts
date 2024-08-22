import middy from '@middy/core';

import type {
  Callback as LambdaCallback,
  Context as LambdaContext,
} from 'aws-lambda';

export default function handler(
  fun: (
    event: any,
    context: LambdaContext,
    callback: LambdaCallback,
  ) => void | Promise<unknown>,
  middlewares: Array<middy.MiddlewareObj<any>>,
) {
  const fn = middy<Event, unknown, Error, LambdaContext>(fun);

  middlewares.forEach(middleware => {
    fn.use(middleware);
  });

  return fn;
}
