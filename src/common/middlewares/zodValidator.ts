import type middy from '@middy/core';
import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {ZodSchema} from 'zod';

import {validateZodSchema} from './validateZodSchema';

type Options = {
  requestSchema?: ZodSchema;
  responseSchema?: Record<number, ZodSchema> | ZodSchema;
};

export const zodValidatorMiddleware = (
  options: Options,
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const {requestSchema, responseSchema} = options;

  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (request): Promise<void> => {
    const {event} = request;

    if (requestSchema) validateZodSchema(requestSchema, event);
  };

  const after: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (event): Promise<void> => {
    const {response} = event;

    if (responseSchema && 200 in responseSchema) {
      if (response?.body) {
        // This "if" statement is necessary for the websocket lambdas that return strings and not objects.
        const bodyParse =
          typeof response?.body === 'string'
            ? JSON.parse(response?.body)
            : response?.body;

        response.body = bodyParse;
      }

      const newFormat: ZodSchema | undefined = responseSchema['200'];

      validateZodSchema(
        newFormat || (responseSchema as unknown as ZodSchema),
        response,
      );
    }
  };

  return {
    before,
    after,
  };
};
