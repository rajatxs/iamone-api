import { 
   Controller, 
   Get, 
   Post, 
   Body, 
   Put,
   Delete,
   Param,
   UsePipes,
   Logger,
   InternalServerErrorException,
   NotFoundException,
   BadRequestException
} from '@nestjs/common'
import { InsertOneResult, UpdateResult, DeleteResult } from 'mongodb'
import { JoiValidationPipe } from '@pipes/validation'
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/role.decorator'
import { SocialServiceProvider } from './social-service.service'
import { SocialService, PartialSocialService } from './social-service.interface'
import { createSchema, updateSchema } from './social-service.schema'

@Controller('social-service')
export class SocialServiceController {
   private readonly logger = new Logger
   constructor(private readonly socialService: SocialServiceProvider) { }

   @Get() 
   @Roles(Role.Anonymous)
   async getAllSocialServices(): Promise<ApiResponse> {
      let result: PartialSocialService[]

      try {
         result = await this.socialService.findAll()
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

   @Get(':id')
   @Roles(Role.Anonymous)
   async getSocialService(@Param('id') id: DocId): Promise<ApiResponse> {
      let result: PartialSocialService

      try {
         if (id.toString().startsWith('@')) {
            result = await this.socialService.findByKey(id.toString().substr(1))
         } else {
            result = await this.socialService.get(id)
         }
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

   @Post()
   @Roles(Role.Admin)
   @UsePipes(new JoiValidationPipe(createSchema))
   async addNewSocialService(@Body() data: SocialService): Promise<ApiResponse> {
      let result: InsertOneResult, insertedId: DocId

      // check for duplication
      if (await this.socialService.isDuplicate(data)) {
         throw new BadRequestException("Given template url is already in use")
      }

      try {
         result = await this.socialService.add(data)
         insertedId = result.insertedId
         this.logger.log(`Social service added ${insertedId}`)
      } catch (error) {
         this.logger.error("Error while adding new social service")
         throw new InternalServerErrorException("Failed to add new social service")
      }

      return {
         statusCode: 201,
         message: "Social service added",
         result: { insertedId }
      }
   }

   @Put(':id')
   @Roles(Role.Admin)
   @UsePipes(new JoiValidationPipe(updateSchema))
   async updateSocialService(@Param('id') id: DocId, @Body() data: PartialSocialService): Promise<ApiResponse> {
      let result: UpdateResult, statusCode: number, message: string

      try {
         result = await this.socialService.update(id, data)
      } catch (error) {
         this.logger.error("Error while updating social service", error)
         throw new InternalServerErrorException("Failed to update social service")
      }

      if (result.modifiedCount === 0) {
         statusCode = 200
         message = "Nothing to be updated"
      } else {
         statusCode = 201
         message = "Social service updated"
      }

      return { statusCode, message }
   }

   @Delete(':id')
   @Roles(Role.Admin)
   async removeSocialService(@Param('id') id: DocId): Promise<ApiResponse> {
      let result: DeleteResult

      try {
         result = await this.socialService.remove(id)
      } catch (error) {
         this.logger.error("Error while delete social service item", error)
         throw new InternalServerErrorException("Failed to remove social service")
      }

      if (result.deletedCount === 0) {
         throw new NotFoundException("Service not found")
      }

      return {
         statusCode: 200,
         message: "Social service has been removed"
      }
   }
}
