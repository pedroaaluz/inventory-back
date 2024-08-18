import {BadRequest} from 'http-errors';
import {ZodSchema, z} from 'zod';
import {fromZodError} from 'zod-validation-error';

export function validateZodSchema<T extends ZodSchema>(
  schema: T,
  data: any,
): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (error: any) {
    // using any because try only has one operation that return zod error
    const validationError = fromZodError(error);

    throw new BadRequest(validationError.message);
  }
}
