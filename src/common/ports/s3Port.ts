// src/lambda/createProduct/ports/s3Port.ts
export interface S3Port {
  uploadFile(key: string, body: Buffer): Promise<string>;
  getFile(key: string): Promise<Buffer>;
}
