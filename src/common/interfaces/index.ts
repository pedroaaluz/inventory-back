export interface Controller<requestSchema, responseSchema> {
  exec: (event: requestSchema) => responseSchema;
}

export interface Repository<Input, Output> {
  exec: (param: Input) => Promise<Output>;
}

export interface UseCase<Input, Output> {
  exec: (param: Input) => Promise<Output>;
}
