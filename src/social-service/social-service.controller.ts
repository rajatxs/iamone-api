import { 
   Controller, 
   Get, 
   Param,
   Logger,
   InternalServerErrorException,
   NotFoundException,
} from '@nestjs/common'
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/role.decorator'
import { SocialServiceProvider } from './social-service.service'
import { PartialSocialService } from './social-service.interface'

@Controller('social-service')
@Roles(Role.Anonymous)
export class SocialServiceController {
   readonly logger = new Logger
   constructor(private readonly socialService: SocialServiceProvider) { }

   @Get() 
   getAllSocialServices(): ApiResponse {
      let result: PartialSocialService[]

      try {
         result = this.socialService.list
      } catch (error) {
         this.logger.error("Error while getting social services", error)
         throw new InternalServerErrorException("Failed to get social services")
      }

      return {
         statusCode: 200,
         message: "List of social servies",
         result
      }
   }

   @Get(':key')
   getSocialService(@Param('key') key: string): ApiResponse {
      let result: PartialSocialService

      try {
         result = this.socialService.get(key)
      } catch (error) {
         this.logger.error("Error while getting social service data", error)
         throw new InternalServerErrorException("Failed to get social service data")
      }

      if (!result) {
         throw new NotFoundException("Social service not")
      }

      return {
         statusCode: 200,
         message: "Data of Social service",
         result
      }
   }
}
