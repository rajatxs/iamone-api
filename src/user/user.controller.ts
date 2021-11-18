import * as bcrypt from 'bcryptjs'
import {
   Controller,
   Req,
   Res,
   Get,
   Post,
   Put,
   Delete,
   Body,
   InternalServerErrorException,
   Logger,
   UsePipes,
   UseInterceptors,
   UploadedFile,
   BadRequestException,
   NotFoundException,
   Param
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response, Express } from 'express'
import { InsertOneResult, ObjectId } from 'mongodb'
import { JoiValidationPipe } from '@pipes/validation'
import { setPasswordHash } from '@utils/common'
import { UserService } from './user.service'
import { UserImageUploadOptions } from './user.setup'
import { createSchema, updateSchema, verifySchema } from './user.schema'
import { User, UserCredentials, MutableUserFields } from './user.interface'
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/role.decorator'
import { AuthService } from '../auth/auth.service'
import { RegisteredAuthTokenResponse } from '../auth/auth.interface'

@Controller('user')
export class UserController {
   private readonly logger = new Logger

   constructor(
      private readonly userService: UserService,
      private readonly authService: AuthService
   ) { }

   @Get()
   @Roles(Role.Admin)
   async getAllUsers(): Promise<ApiResponse> {
      let result: User[]

      try {
         result = await this.userService.findAll()
      } catch (error) {
         this.logger.error("Error while getting users", error)
         throw new InternalServerErrorException("Failed to get users")
      }

      return {
         statusCode: 200,
         message: "List of users",
         result
      }
   }

   @Get('detail')
   @Roles(Role.User)
   async getAccountDetail(@Req() req: Request): Promise<ApiResponse> {
      const { userId } = req.locals
      let result: User

      try {
         result = await this.userService.get(userId)
      } catch (error) {
         this.logger.error("Error while getting account data", error)
         throw new InternalServerErrorException("Failed to get yout account data")
      }

      return {
         statusCode: 200,
         message: "Account data",
         result
      }
   }

   @Post('register')
   @Roles(Role.Anonymous)
   @UsePipes(new JoiValidationPipe(createSchema))
   async registerNewUser(@Req() req: Request, @Body() data: User): Promise<ApiResponse> {
      let newUser: InsertOneResult, result: RegisteredAuthTokenResponse, insertedId: ObjectId, user: User

      // check username
      if (await this.userService.hasUsername(data.username)) {
         throw new BadRequestException("Account is already registered with given username")
      }

      // check email 
      if (await this.userService.hasEmail(data.email)) {
         throw new BadRequestException('Account is already registered with given email address')
      }

      try {
         // preset data
         data.httpRequestId = req.locals.requestId

         data = await setPasswordHash<User>(data)
         newUser = await this.userService.create(data)
         insertedId = newUser.insertedId

         this.logger.log(`User created ${insertedId}`)

         // get newly created user
         user = await this.userService.get(insertedId)
         
         // generate auth token
         result = await this.authService.generateUserAuthToken({
            id: insertedId.toString(),
            name: user.fullname,
            email: user.email,
            email_verified: user.emailVerified
         }, user.username)

      } catch (error) {
         this.logger.error(error)
         throw new InternalServerErrorException("Failed to create your account")
      }

      return {
         statusCode: 201,
         message: "Account created",
         result
      }
   }

   @Post('token')
   @Roles(Role.Anonymous)
   @UsePipes(new JoiValidationPipe(verifySchema))
   async generateAccessToken(@Body() data: UserCredentials): Promise<ApiResponse> {
      const { username, email, password } = data
      let user: User, isPasswordCorrect = false, result: RegisteredAuthTokenResponse

      if (!username && !email) {
         throw new BadRequestException("Require username or email")
      }

      // get user object
      try {
         user = await this.userService.findByUsernameOrEmail(username, email)
      } catch (error) {
         this.logger.log("Failed to get user document", error)
         throw new InternalServerErrorException("Failed to get your account")
      }

      if (!user) {
         throw new NotFoundException("Account not registered with given username or email")
      }

      // compare password hash
      try {
         isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
      } catch (error) {
         this.logger.error("Error while decode user password", error)
         throw new InternalServerErrorException("Failed to decrypt your credentials")
      }

      if (!isPasswordCorrect) {
         throw new BadRequestException("Incorrect password")
      }

      // register auth token
      try {
         result = await this.authService.generateUserAuthToken({
            id: (user._id).toString(),
            name: user.fullname,
            email: user.email,
            email_verified: user.emailVerified
         }, user.username)
      } catch (error) {
         this.logger.error("Error while registering new user auth token", error)
         throw new InternalServerErrorException("Failed to initialize your login session")
      }

      return {
         statusCode: 201,
         message: "Auth token generated",
         result
      }
   }

   @Put('detail')
   @Roles(Role.User)
   @UsePipes(new JoiValidationPipe(updateSchema))
   async updateProfileDetails(@Req() req: Request, @Body() data: MutableUserFields): Promise<ApiResponse> {
      const { userId } = req.locals

      try {
         await this.userService.update(userId, data)
      } catch (error) {
         throw new InternalServerErrorException('Failed to update yout profile')
      }

      return {
         statusCode: 201,
         message: "Profile has been updated"
      }
   }

   @Post('image')
   @Roles(Role.User)
   @UseInterceptors(FileInterceptor('file', UserImageUploadOptions))
   async uploadProfilePicture(@Req() req: Request, @UploadedFile() file: Express.Multer.File): Promise<ApiResponse> {
      try {
         await this.userService.uploadImage(req.locals.userId, file)
      } catch (error) {
         throw new InternalServerErrorException("Failed to upload your profile image")
      }

      return {
         statusCode: 201,
         message: "Profile image uploaded successfully"
      }
   }

   @Delete('image')
   @Roles(Role.User)
   async deleteUserImage(@Req() req: Request): Promise<ApiResponse> {
      try {
         await this.userService.removeImage(req.locals.userId)
      } catch (error) {
         this.logger.error("Error while removing profile image", error)
         throw new InternalServerErrorException("Failed to remove profile image")
      }

      return {
         statusCode: 200,
         message: "Profile image has been removed"
      }
   }

   @Get('image/:id')
   @Roles(Role.Anonymous)
   async getUserImage(@Res() res: Response, @Param('id') fileId: string) {
      try {
         const image = await this.userService.getImage(fileId)
         
         if (!image) {
            return res.status(404).json(<ApiResponse>{
               statusCode: 404,
               message: 'Image not found'
            })
         }
         
         return image.pipe(res, { end: true })
      } catch (error) {
         this.logger.error("Error while getting profile image", error)
         return res.status(500).json(<ApiResponse>{
            statusCode: 500,
            message: "Failed to get profile image"
         })
      }
   }

   @Delete('account')
   @Roles(Role.User)
   async deleteUserAccount(@Req() req: Request): Promise<ApiResponse> {
      const { userId } = req.locals
      let result: boolean

      try {
         result = await this.userService.deleteById(userId)     
      } catch (error) {
         throw new InternalServerErrorException("Failed to delete your account")
      }

      return {
         statusCode: 200,
         message: "Account has been deleted"
      }
   }
}
