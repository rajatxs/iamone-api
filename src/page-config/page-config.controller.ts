import { Controller, Get, Req, Put, Logger, UsePipes, Body, InternalServerErrorException } from '@nestjs/common'
import { PageConfigService } from './page-config.service'
import { Request } from 'express'
import { JoiValidationPipe } from '@pipes/validation'
import { updateSchema } from './page-config.schema'
import { PartialPageConfig } from './page-config.interface'
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
         throw new InternalServerErrorException('Failed to get page config')
      }

      return {
         statusCode: 200,
         message: 'Page config',
         result
      }
   }

   @Put()
   @UsePipes(new JoiValidationPipe(updateSchema))
   async updatePageConfig(@Req() req: Request, @Body() data: PartialPageConfig): Promise<ApiResponse> {
      const { userId } = req.locals

      try {
         await this.pageConfigService.update({ userId }, data)
      } catch (error) {
         this.logger.error('Error while updating page config', error)
         throw new InternalServerErrorException('Failed to update page config')
      }

      return {
         statusCode: 201,
         message: 'Config updated',
      }
   }
}
