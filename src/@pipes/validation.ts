import {
   Injectable,
   PipeTransform,
   ArgumentMetadata,
   BadRequestException
} from '@nestjs/common'
import { ObjectSchema } from 'joi'

@Injectable()
export class JoiValidationPipe implements PipeTransform {
   constructor(private readonly schema: ObjectSchema) { }

   transform(value: any, metadata: ArgumentMetadata) {
      switch (metadata.type) {
         case 'body':
            const { value: result, error } = this.schema.validate(value, {
               convert: true,
               allowUnknown: false
            })

            if (error) {
               throw new BadRequestException(error.message)
            }

            value = result
            break
      }

      return value
   }
}
