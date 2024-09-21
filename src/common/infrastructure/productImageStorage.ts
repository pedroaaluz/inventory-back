import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import {Buffer} from 'buffer';

interface S3Port {
  uploadFile(base64: string, key: string): Promise<string>;
}

export class ProductImageStorage implements S3Port {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({region: 'sa-east-1'});
  }

  private decodeBase64(base64: string): {buffer: Buffer; mimeType: string} {
    let mimeType: string;
    if (base64.startsWith('data:image/jpeg;base64,')) {
      mimeType = 'image/jpeg';
      base64 = base64.replace(/^data:image\/jpeg;base64,/, '');
    } else if (base64.startsWith('data:image/png;base64,')) {
      mimeType = 'image/png';
      base64 = base64.replace(/^data:image\/png;base64,/, '');
    } else {
      throw new Error(
        'Format image not supported. Supported formats: jpeg, png',
      );
    }

    const buffer = Buffer.from(base64, 'base64');
    return {buffer, mimeType};
  }

  async uploadFile(base64: string, key: string): Promise<string> {
    const {buffer, mimeType} = this.decodeBase64(base64);

    const params: PutObjectCommandInput = {
      Bucket: `products-images-bucket-${process.env.STAGE}`,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3.send(command);

      return `https://${params.Bucket}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error in upload image', error);
      throw new Error('Error in upload image.');
    }
  }
}
