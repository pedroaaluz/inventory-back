import type middy from '@middy/core';

interface IResponse {
  body?: string | Record<string, unknown>;
}

export default function httpResponseStringify(): middy.MiddlewareObj<
  unknown,
  IResponse
> {
  const after: middy.MiddlewareFn<unknown, IResponse> = async (
    request,
  ): Promise<void> => {
    const {response} = request;

    // Verifica se o body existe e se não está no formato de string
    if (response && response.body && typeof response.body !== 'string') {
      try {
        response.body = JSON.stringify(response.body); // Converte o body em string
      } catch (e) {
        // Opcionalmente, lidar com erros de conversão
        console.error('Failed to stringify response body:', e);
        response.body = 'Failed to process response body';
      }
    }
  };

  return {
    after,
  };
}
