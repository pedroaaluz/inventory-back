import type {AWS, AwsArn} from '@serverless/typescript';
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
  Context as IContext,
  SQSEvent as ISQSEvent,
  SQSBatchItemFailure,
  SQSRecord,
} from 'aws-lambda';
import type {z} from 'zod';

export type Context = IContext;

// DOCUMENTATION TYPES
interface RequestBody {
  description: string;
  content: Record<string, unknown>;
}

type ModelsRef = {'application/json': string} | {'application/xml': string};

export interface Models {
  name: string;
  description?: string;
  contentType: 'application/json' | 'application/xml';
  schema: unknown;
}

interface DefaultParams {
  name: string;
  description?: string;
  schema: {
    type: string;
  };
}

interface QueryParams extends DefaultParams {
  required?: boolean;
  schema: {
    type: string;
    enum?: string[] | number[];
  };
}

interface ResponseInfo {
  description: string;
}

export interface Documentation {
  summary: string;
  description: string;
  tags?: string[];
  deprecated?: boolean;
  requestBody?: RequestBody;
  requestModels?: ModelsRef;
  queryParams?: QueryParams[];
  pathParams?: DefaultParams[];
  cookieParams?: DefaultParams[];
  responses: Record<number, ResponseInfo>;
  models?: Models[];
}
// END DOCUMENTATION TYPES

// LAMBDA TYPES
type Events = NonNullable<
  NonNullable<AWS['functions']>['k']['events']
> extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export type CustomHttpEvent = {
  http: {
    method: string;
    path: string;
    authorizer?: string;
    description?: string;
  };
};

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type CustomHttp = CustomHttpEvent | Extract<Events, {http: object}>;

interface IamRoleStatement {
  Effect: 'Allow' | 'Deny';
  Action: string[];
  Resource: AwsArn | AwsArn[];
}

export type LambdaType = Omit<NonNullable<AWS['functions']>['k'], 'events'> & {
  documentation?: Documentation;
  requestSchema?: z.ZodTypeAny;
  events?: (Events | CustomHttp)[];
  iamRoleStatementsName?: string;
  iamRoleStatements?: IamRoleStatement[];
  iamRoleStatementsInherit?: boolean;
};
// END LAMBDA TYPES

interface RequestHttpBaseSchema {
  body?: unknown;
  queryStringParameters?: unknown;
  pathParameters?: unknown;
  requestContext?: unknown;
}

interface RequestWebSocketBaseSchema {
  body?: unknown;
  queryStringParameters?: unknown;
  requestContext?: unknown;
}

interface ResponseHttpBaseSchema {
  body?: unknown;
}

// CONTROLLER TYPES
type ValidatedAPIGatewayProxyEvent<
  RequestSchema extends RequestHttpBaseSchema,
> = Omit<
  APIGatewayProxyEvent,
  'body' | 'queryStringParameters' | 'pathParameters' | 'requestContext'
> &
  RequestSchema;

type ValidatedAPIGatewayProxyResult<
  ResponseSchema extends ResponseHttpBaseSchema,
> = Omit<APIGatewayProxyResult, 'body'> & ResponseSchema;

export type HttpEvent<RequestSchema extends RequestHttpBaseSchema> =
  ValidatedAPIGatewayProxyEvent<RequestSchema>;

export type HttpResponse<ResponseSchema extends ResponseHttpBaseSchema> =
  ValidatedAPIGatewayProxyResult<ResponseSchema>;

export type WebSocketEvent<RequestSchema extends RequestWebSocketBaseSchema> =
  ValidatedAPIGatewayProxyEvent<RequestSchema>;

export type HttpFn<
  RequestSchema extends RequestHttpBaseSchema,
  ResponseSchema extends ResponseHttpBaseSchema,
> = Handler<
  HttpEvent<RequestSchema>,
  ValidatedAPIGatewayProxyResult<ResponseSchema>
>;

export type WebSocketFn<RequestSchema extends RequestHttpBaseSchema> = Handler<
  WebSocketEvent<RequestSchema>,
  void
>;

// SQS
interface SQSRecordBaseSchema {
  body: unknown;
}

type ValidatedSQSEvent<RequestSchema extends SQSRecordBaseSchema> = Omit<
  ISQSEvent,
  'Records'
> & {
  Records: (Omit<SQSRecord, 'body'> & RequestSchema)[];
};

export type SQSEvent<RequestSchema extends SQSRecordBaseSchema> =
  ValidatedSQSEvent<RequestSchema>;

export type SQSResult<ResponseSchema> = {
  batchItemFailures: (SQSBatchItemFailure & {reason?: string})[];
  batchItemWarnings?: {itemIdentifier: string; reason: string}[];
  batchItemResponses?: {
    MessageBody: ResponseSchema;
    MessageGroupId?: string;
    MessageDeduplicationId?: string;
    requestId?: string;
    previousMessageId: string;
  }[];
};

export type SqsFn<RequestSchema extends SQSRecordBaseSchema, ResponseSchema> = (
  event: SQSEvent<RequestSchema>,
  context: Context,
) => void | Promise<void | SQSResult<ResponseSchema>>;

// END CONTROLLER TYPES
