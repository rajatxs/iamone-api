import {
   Controller,
   Req,
   Get,
   Post,
   Put,
   Body,
   Param,
   UseGuards,
   BadRequestException,
   UsePipes,
   Logger,
   InternalServerErrorException,
   NotFoundException,
   Delete,
   ConflictException,
} from '@nestjs/common'
import { Request } from 'express'
import { JoiValidationPipe } from '@pipes/validation'
import { DeleteResult, InsertOneResult, ObjectId } from 'mongodb'
import { SocialServiceProvider } from '../social-service/social-service.service'
import { SocialRefService } from './social-ref.service'
import { SocialRef, PartialSocialRef } from './social-ref.interface'
import { AuthGuard } from '../auth/auth.guard'
import { createSchema, updateSchema } from './social-ref.schema'

@Controller('social-ref')
@UseGuards(AuthGuard)
export class SocialRefController {
   private readonly ALLOWED_MAX_REFS = 16
   private readonly logger = new Logger()

   constructor(
      private readonly socialRefService: SocialRefService,
      private readonly socialServiceProvider: SocialServiceProvider,
   ) {}

   @Get()
   async getAllSocialRefs(@Req() req: Request): Promise<ApiResponse> {
      const { userId } = req.locals
      let result: PartialSocialRef[]

      try {
         result = await this.socialRefService.findAll({ userId })
      } catch (error) {
         this.logger.error('Error while getting social links', error)
         throw new InternalServerErrorException(
            'Failed to get your social links',
         )
      }

      return {
         statusCode: 200,
         message: 'Social links',
         result,
      }
   }

   @Get(':id')
   async getSocialRef(
      @Req() req: Request,
      @Param('id') id: DocId,
   ): Promise<ApiResponse> {
      const { userId } = req.locals
      let result: PartialSocialRef

      try {
         result = await this.socialRefService.findOne({
            _id: new ObjectId(id),
            userId,
         })
      } catch (error) {
         this.logger.error('Error while getting social link')
         throw new InternalServerErrorException(
            'Failed to get social link data',
         )
      }

      if (!result) {
         throw new NotFoundException('Social link not found')
      }

      return {
         statusCode: 200,
         message: 'Social link',
         result,
      }
   }

   @Post()
   @UsePipes(new JoiValidationPipe(createSchema))
   async addNewSocialRef(
      @Req() req: Request,
      @Body() data: SocialRef,
   ): Promise<ApiResponse> {
      const { userId } = req.locals
      let result: InsertOneResult, insertedId: ObjectId, totalRefs: number

      data.userId = userId
      totalRefs = await this.socialRefService.count({ userId })

      // limit number of links
      if (totalRefs >= this.ALLOWED_MAX_REFS) {
         throw new BadRequestException('You added maximum number of links')
      }

      // check social service availability
      if (!(await this.socialServiceProvider.hasKey(data.socialServiceKey))) {
         throw new BadRequestException('Invalid service key')
      }

      // prevent duplication
      if (await this.socialRefService.isDuplicate(data)) {
         throw new ConflictException(
            'Link is already exists with same slug value',
         )
      }

      try {
         result = await this.socialRefService.insert(data)
         insertedId = result.insertedId
      } catch (error) {
         throw new InternalServerErrorException('Failed to add new social link')
      }

      return {
         statusCode: 201,
         message: 'Link added',
         result: { insertedId },
      }
   }

   @Put(':id')
   @UsePipes(new JoiValidationPipe(updateSchema))
   async updateSocialRef(
      @Req() req: Request,
      @Param('id') id: DocId,
      @Body() data: PartialSocialRef,
   ): Promise<ApiResponse> {
      const { userId } = req.locals

      // check social service availability
      if (data['socialServiceKey']) {
         const keyExists = await this.socialServiceProvider.hasKey(data.socialServiceKey)
         if (!keyExists) {
            throw new BadRequestException('Invalid service key')
         }
      }

      // prevent duplication
      if (data['slug'] && data['socialServiceKey']) {
         if (await this.socialRefService.isDuplicate(data)) {
            throw new ConflictException(
               'Link is already exists with same slug value',
            )
         }
      }

      try {
         await this.socialRefService.update(
            { _id: new ObjectId(id), userId },
            data,
         )
      } catch (error) {
         throw new InternalServerErrorException('Failed to update link')
      }

      return {
         statusCode: 201,
         message: 'Link has been updated',
      }
   }

   @Delete(':id')
   async deleteSocialRef(
      @Req() req: Request,
      @Param('id') id: DocId,
   ): Promise<ApiResponse> {
      const { userId } = req.locals
      let result: DeleteResult

      try {
         result = await this.socialRefService.remove({
            _id: new ObjectId(id),
            userId,
         })
      } catch (error) {
         this.logger.error('Error while delete social ref', error)
         throw new InternalServerErrorException(
            'Failed to remove your social link',
         )
      }

      if (result.deletedCount === 0) {
         throw new NotFoundException('Unaccaptable social link id')
      }

      return {
         statusCode: 200,
         message: 'Social link has been removed',
      }
   }
}
