/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Metadata } from '@grpc/grpc-js';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

type Constructor<T = object> = new (...args: any[]) => T;
type PrimitiveConstructor =
  | Constructor<Array<any>>
  | Constructor<boolean>
  | Constructor<number>
  | Constructor<object>
  | Constructor<string>;

@Injectable()
export class CustomValidationPipe<T extends object = Record<string, unknown>>
  implements PipeTransform
{
  private readonly logger = new Logger(CustomValidationPipe.name);

  async transform(value: unknown, { metatype }: ArgumentMetadata): Promise<T> {
    if (!metatype || !this.toValidate(metatype)) {
      return value as T;
    }

    const object = plainToInstance(metatype as Constructor<T>, value as object);
    const errors = await validate(object);

    if (errors.length > 0) {
      this.logger.error(`Validation failed: ${JSON.stringify(errors)}`);

      const validationErrors = this.formatValidationErrors(errors);

      throw new BadRequestException({
        message: 'Validation failed',
        details: validationErrors,
      });
    }

    return object;
  }

  private formatValidationErrors(
    errors: ValidationError[],
  ): Array<{ field: string; message: string }> {
    const formattedErrors: Array<{ field: string; message: string }> = [];

    for (const error of errors) {
      if (error.constraints) {
        for (const message of Object.values(error.constraints)) {
          formattedErrors.push({
            field: error.property,
            message,
          });
        }
      }
    }

    return formattedErrors;
  }

  private toValidate(metatype: Constructor): boolean {
    if (metatype === Metadata) {
      return false;
    }

    const primitiveTypes: PrimitiveConstructor[] = [String, Number, Boolean, Array, Object];
    return !primitiveTypes.includes(metatype as PrimitiveConstructor);
  }
}
