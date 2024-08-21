/* eslint-disable no-param-reassign */
import type middy from '@middy/core';
import {APIGatewayProxyEventQueryStringParameters} from 'aws-lambda';

interface IEvent {
  requestContext?: {
    connectionId?: string;
    httpMethod?: string;
    apiId?: string;
    routeKey?: string;
  };
  httpMethod?: string;
  body?: string | Record<string, unknown>;
  Records?: Array<{
    body?: string | Record<string, unknown>;
  }>;
  queryStringParameters?: APIGatewayProxyEventQueryStringParameters | null;
}

function stringParser(
  string?: Record<string, unknown> | string,
): Record<string, unknown> {
  if (!string) return {};

  try {
    return typeof string === 'string'
      ? (JSON.parse(string) as Record<string, unknown>)
      : string;
  } catch (e) {
    return {value: string};
  }
}

export default function httpBodyNormalize(): middy.MiddlewareObj<
  IEvent,
  unknown
> {
  const before: middy.MiddlewareFn<IEvent, unknown> = async (
    request,
  ): Promise<void> => {
    const {event} = request;

    if (event.Records) {
      event.Records.forEach(record => {
        record.body = stringParser(record.body);
      });
    } else {
      request.event.body = stringParser(event.body);
    }
  };

  return {
    before,
  };
}
