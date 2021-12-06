import { Controller, Get, Post, Req, Param, Put, Logger, UsePipes, Body, ConflictException, InternalServerErrorException } from '@nestjs/common'
import { PageConfigService } from './page-config.service'
import { Request } from 'express'
import { JoiValidationPipe } from '@pipes/validation'
import { DeleteResult, InsertOneResult, ObjectId } from 'mongodb'
import { createSchema, updateSchema } from './page-config.schema'
import { PageConfig, PartialPageConfig } from './page-config.interface'
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/role.decorator'

@Controller('page-config')
@Roles(Role.User)
export class PageConfigController {
   private readonly logger = new Logger()

   constructor(private pageConfigService: PageConfigService) { }

   @Get()
   async getPageConfig(@Req() req: Request): Promise<ApiResponse> {
      const { userId } = req.locals
      let result: PartialPageConfig

      try {
         result = await this.pageConfigService.findByUserId(userId)
      } catch (error) {
         this.logger.error('Error while getting page config', error)
         throw new InternalServerErrorException('Failed to get your social links')
      }

      return {
         statusCode: 200,
         message: 'Page config',
         result
      }
   }

   @Post()
   @UsePipes(new JoiValidationPipe(createSchema))
   async addNewSocialRef(@Req() req: Request, @Body() data: PageConfig): Promise<ApiResponse> {
      const { userId } = req.locals
      let result: InsertOneResult, insertedId: ObjectId, totalRefs: number

      data.userId = userId

      // prevent duplication
      if (await this.pageConfigService.isDuplicate(data)) {
         throw new ConflictException(
            'Page config is already exists',
         )
      }

      try {
         result = await this.pageConfigService.create(data)
         insertedId = result.insertedId
      } catch (error) {
         this.logger.error('Error while adding page config', error)
         throw new InternalServerErrorException('Failed to add new social link')
      }

      return {
         statusCode: 201,
         message: 'Config added',
         result: { insertedId },
      }
   }

   @Put()
   @UsePipes(new JoiValidationPipe(updateSchema))
   async updateSocialRef(@Req() req: Request, @Param('id') id: DocId, @Body() data: PartialPageConfig): Promise<ApiResponse> {
      const { userId } = req.locals

      try {
         await this.pageConfigService.update({ userId }, data)
      } catch (error) {
         this.logger.error('Error while updating page config', error)
         throw new InternalServerErrorException('Failed to update link')
      }

      return {
         statusCode: 201,
         message: 'Config updated',
      }
   }
}
