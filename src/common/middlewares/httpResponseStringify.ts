/* eslint-disable @typescript-eslint/ban-ts-comment */
import type middy from '@middy/core';

interface IResponse {
  body?: string | Record<string, unknown>;
  headers?: Record<string, string>;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'X-Amz-Security-Token',
};

export default function httpResponseStringify(): middy.MiddlewareObj<
  unknown,
  IResponse
> {
  const after: middy.MiddlewareFn<unknown, IResponse> = async (
    request,
  ): Promise<void> => {
    const headers = {
      //@ts-ignore uncessary check
      ...request.response?.headers,
      //@ts-ignore uncessary check
      ...request.context.responseHeaders,
      ...corsHeaders,
    };

    if (process.env.IS_LOCAL) {
      request.response = {
        ...request.response,
        headers,
      };
    } else {
      request.response = {
        ...request.response,
        headers,
        body: JSON.stringify(request.response?.body || {}),
      };
    }

    return;
  };

  return {
    after,
  };
}
