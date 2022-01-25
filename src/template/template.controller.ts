import { Controller, Get, InternalServerErrorException, Req } from '@nestjs/common'
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/role.decorator'
import { TemplateService } from './template.service'
import { Request } from 'express'

@Controller('template')
export class TemplateController {

   constructor(private readonly templateService: TemplateService) {}

   @Get('/data')
   @Roles(Role.User)
   async getTemplateData(@Req() req: Request): Promise<ApiResponse> {
      const { userId } = req.locals
      let result = null

      try {
         result = await this.templateService.getPureDataByUserId(userId)
      } catch (error) {
         throw new InternalServerErrorException("Failed to get account data")
      }
      return {
         statusCode: 200,
         message: "Template data",
         result
      }
   }

   @Get('/list')
   @Roles(Role.Anonymous) 
   getTemplateList(): ApiResponse {
      let result = []
      
      try {
         result = require('../../data/themes.json')
      } catch (error) {
         throw new InternalServerErrorException("Failed to design themes")
      }

      return {
         statusCode: 200,
         message: "List of themes",
         result
      }
   }
}
