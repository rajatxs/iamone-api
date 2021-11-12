import {
   Controller,
   Get,
   Post,
   Body,
   Put,
   Delete,
   Param,
   Logger,
   HttpCode,
   Req,
   InternalServerErrorException,
   UsePipes,
   BadRequestException,
   NotFoundException
} from '@nestjs/common'
import { Request } from 'express'
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/role.decorator'
import { ClinkService } from './clink.service'
import { CLink, PartialCLink, SiteMetadata } from './clink.interface'
import { InsertOneResult } from 'mongodb'
import { JoiValidationPipe } from '@pipes/validation'
import { createSchema, updateSchema } from './clink.schema'

@Controller('clink')
@Roles(Role.User)
export class ClinkController {
   readonly ALLOWED_MAX_LINKS = 36
   readonly logger = new Logger
   constructor(readonly clinkService: ClinkService) { }

   @Get()
   async getAllCLinkList(@Req() req: Request): Promise<ApiResponse> {
      const { userId } = req.locals
      let result: CLink[]

      try {
         result = await this.clinkService.findAll({ userId })
      } catch (error) {
         this.logger.error("Error while getting clinks", error)
         throw new InternalServerErrorException("Failed to get links")
      }

      return {
         statusCode: 200,
         message: "List of custom links",
         result
      }
   }

   @Post()
   @UsePipes(new JoiValidationPipe(createSchema))
   async addNewCLink(@Req() req: Request, @Body() data: CLink): Promise<ApiResponse> {
      const { userId } = req.locals
      let result: InsertOneResult, insertedId: DocId, totalLinks: number

      data.userId = userId
      totalLinks = await this.clinkService.count({ userId })

      // limit number of links
      if (totalLinks >= this.ALLOWED_MAX_LINKS) {
         throw new BadRequestException('You added maximum number of links')
      }

      if (await this.clinkService.isDuplicate(data)) {
         throw new BadRequestException("Given link is already added")
      }

      try {
         result = await this.clinkService.add(data)
         insertedId = result.insertedId
      } catch (error) {
         this.logger.error("Error while adding new link", error)
         throw new InternalServerErrorException("Failed to add new custom link")
      }

      return {
         statusCode: 201,
         message: "Link added",
         result: { insertedId }
      }
   }

   @Post('metadata')
   @HttpCode(200)
   async getSiteMetadata(@Body('url') url: string): Promise<ApiResponse> {
      let meta: SiteMetadata

      try {
         meta = await this.clinkService.fetchSiteMetadata(url)
      } catch (error) {
         this.logger.error("Error while getting site metadata", error)
         throw new InternalServerErrorException("Failed to get site metadata")
      }
      return {
         statusCode: 200,
         message: "Metadata fetched successfully",
         result: meta
      }
   }

   @Put(':id')
   @UsePipes(new JoiValidationPipe(updateSchema))
   async updateCLink(@Req() req: Request, @Param('id') linkId: DocId, @Body() body: PartialCLink): Promise<ApiResponse> {

      if (!(await this.clinkService.has(linkId))) {
         throw new NotFoundException("Link not found")
      }

      try {
         await this.clinkService.update(linkId, body)
      } catch (error) {
         this.logger.error("Error while updating clink", error)
         throw new InternalServerErrorException("Failed to update link")
      }
      return {
         statusCode: 200,
         message: "Link updated"
      }
   }

   @Delete(':id')
   async removeCLink(@Param('id') linkId: DocId): Promise<ApiResponse> {
      try {
         await this.clinkService.remove(linkId)
      } catch (error) {
         this.logger.error("Error while removing clink", error)
         throw new InternalServerErrorException("Failed to remove link")
      }
      return {
         statusCode: 200,
         message: "Link removed"
      }
   }
}
