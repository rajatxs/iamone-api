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
   Param,
   Query
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response, Express } from 'express'
import { InsertOneResult, ObjectId, GridFSBucketReadStream } from 'mongodb'
import { JoiValidationPipe } from '@pipes/validation'
import { UserService } from './user.service'
import { generatePasswordHash, setPasswordHash, comparePassword } from '@utils/password'
import { verificationCode } from '@utils/random'
import { UserImageUploadOptions } from './user.setup'
import { 
   createSchema, 
   updateSchema, 
   verifySchema,
   usernameUpdateSchema,
   emailUpdateSchema,
   passwordUpdateSchema,
   emailVerificationSchema,
   passwordResetSchema
} from './user.schema'
import { 
   User, 
   UserCredentials, 
   MutableUserFields, 
   PasswordUpdateFields,
   PasswordResetFields 
} from './user.interface'
import { EmailService } from '../email/email.service'
import { VerificationService } from '../verification/verification.service'
import { VerificationType } from '../verification/verification.interface'
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/role.decorator'
import { AuthService } from '../auth/auth.service'
import { RegisteredAuthTokenResponse } from '../auth/auth.interface'
import { ClientResponse } from '@sendgrid/client/src/response'
import { PageConfigService } from '../page-config/page-config.service'
import { createAvatar } from '@dicebear/avatars';
import * as dicebearStyle from '@dicebear/avatars-initials-sprites';

@Controller('user')
export class UserController {
   private readonly logger = new Logger

   constructor(
      private readonly userService: UserService,
      private readonly authService: AuthService,
      private readonly emailService: EmailService,
      private readonly pageConfigService: PageConfigService,
      private readonly verificationService: VerificationService
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

         await this.pageConfigService.create({
            userId: insertedId,
            templateName: 'default',
            theme: 'light-one',
            themeMode: 'AUTO',
            styles: {}
         })

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

      this.emailService
         .sendWelcomeEmail(user.fullname, user.email)
         .then((emailClientResponse) => {
            this.logger.log("Email sent to: " + user.email, emailClientResponse)
         })
         .catch((error) => {
            this.logger.error("Error while sending email to: " + user.email, error)
         })

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
         isPasswordCorrect = await comparePassword(password, user.passwordHash)
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

   @Put('/username')
   @Roles(Role.User)
   @UsePipes(new JoiValidationPipe(usernameUpdateSchema))
   async changeUsername(@Req() req: Request, @Body() data: { username: string }): Promise<ApiResponse> {
      const { username } = data
      const { userId } = req.locals
      let exists: boolean

      exists = await this.userService.hasUsername(username)

      if (exists) {
         throw new BadRequestException("Username has already been taken")
      }

      try {
         await this.userService.setUsername(userId, username)
      } catch (error) {
         this.logger.error("Error while updating username", error)
         throw new InternalServerErrorException("Failed to update username")
      }

      return {
         statusCode: 200,
         message: "Username changed"
      }
   }

   @Put('/email')
   @Roles(Role.User)
   @UsePipes(new JoiValidationPipe(emailUpdateSchema))
   async changeEmail(@Req() req: Request, @Body() data: { email: string }): Promise<ApiResponse> {
      const { email } = data
      const { userId } = req.locals
      let exists: boolean

      exists = await this.userService.hasEmail(email)

      if (exists) {
         throw new BadRequestException("Email is already in use")
      }

      try {
         await this.userService.setEmail(userId, email, false)
      } catch (error) {
         this.logger.error("Error while updating email", error)
         throw new InternalServerErrorException("Failed to update your email")
      }

      return {
         statusCode: 200,
         message: "Email changed"
      }
   }

   @Get('/email/request-verification')
   @Roles(Role.User)
   async sendEmailVerificationCode(@Req() req: Request): Promise<ApiResponse> {
      const { userId } = req.locals
      let code: string, user: User, saved: boolean
      let emailResponse: [ClientResponse, any]

      try {
         user = await this.userService.get(userId)

         if (user.emailVerified) {
            return {
               statusCode: 200,
               message: "Your email is already verified"
            }
         }

         code = String(verificationCode())
         saved = await this.verificationService.saveVerificationCode(
            VerificationType.EMAIL_VERIFICATION,
            userId, 
            code,
            5
         )

         if (!saved) {
            throw new Error()
         }

         emailResponse = await this.emailService.sendEmailVerificationCode(user.fullname, user.email, code)

         if (emailResponse[0].statusCode !== 202) {
            throw new Error()
         }
      } catch (error) {
         throw new InternalServerErrorException("Failed to send verification code")         
      }

      return {
         statusCode: 200,
         message: "Verification code has been sent on your email"
      }
   }

   @Post('/email/verify')
   @Roles(Role.User)
   @UsePipes(new JoiValidationPipe(emailVerificationSchema))
   async verifyEmailFromVerificationCode(@Req() req: Request, @Body() data: { code: string }): Promise<ApiResponse> {
      const { userId } = req.locals
      const { code } = data
      let verified: boolean

      try {
         verified = await this.verificationService.verifyCode(
            VerificationType.EMAIL_VERIFICATION,
            userId, 
            code
         )
      } catch (error) {
         throw new InternalServerErrorException("Failed to verify your email")
      }

      if (!verified) {
         throw new BadRequestException("Invalid verification code")
      }

      await this.userService.markAsVerified(userId)

      return {
         statusCode: 200,
         message: "Your email has been verified"
      }
   }

   @Put('/password')
   @Roles(Role.User)
   @UsePipes(new JoiValidationPipe(passwordUpdateSchema))
   async changePassword(@Req() req: Request, @Body() data: PasswordUpdateFields): Promise<ApiResponse> {
      const { currentPassword, newPassword } = data
      const { userId } = req.locals
      let user: User
      let hash: string

      if (currentPassword === newPassword) {
         throw new BadRequestException("Use different passwords")
      }

      user = await this.userService.get(userId)

      if (await comparePassword(currentPassword, user.passwordHash) === false) {
         throw new BadRequestException("Incorrect current password")
      }

      try {
         hash = await generatePasswordHash(newPassword)
         await this.userService.setPasswordHash(userId, hash)
      } catch (error) {
         this.logger.error("Error while updating your password", error)
         throw new InternalServerErrorException("Failed to update your password")
      }

      return {
         statusCode: 200,
         message: "Password changed"
      }
   }

   @Post('/password/request-reset')
   @Roles(Role.Anonymous)
   async sendPasswordResetCode(@Body() data: { email: string }): Promise<ApiResponse> {
      const { email } = data
      let code: string, user: User, saved: boolean
      let emailResponse: [ClientResponse, any]

      user = await this.userService.findOne({ email })

      if (!user) {
         throw new BadRequestException("Invalid email address")
      }

      try {
         code = String(verificationCode())
         saved = await this.verificationService.saveVerificationCode(VerificationType.PASSWORD_RESET, user._id, code, 10)

         if (!saved) {
            throw new Error()
         }

         emailResponse = await this.emailService.sendPasswordResetCode(user.fullname, user.email, code)

         if (emailResponse[0].statusCode !== 202) {
            throw new Error()
         }
      } catch (error) {
         this.logger.error("Error while sending password reset code", error)
         throw new InternalServerErrorException("Failed to send password reset code")
      }

      return {
         statusCode: 200,
         message: "Password reset code has been sent on your email"
      }
   }

   @Put('/password/reset')
   @Roles(Role.Anonymous)
   @UsePipes(new JoiValidationPipe(passwordResetSchema))
   async resetPassword(@Body() data: PasswordResetFields): Promise<ApiResponse> {
      const { email, password, code } = data
      let verified: boolean
      let hash: string
      let user: User, userId: DocId

      user = await this.userService.findOne({ email })
      
      if (!user) {
         throw new BadRequestException("Invalid email")
      }

      userId = user._id

      try {
         verified = await this.verificationService.verifyCode(
            VerificationType.PASSWORD_RESET,
            userId,
            code
         )
      } catch (error) {
         this.logger.error("Error while reseting password", error)
         throw new InternalServerErrorException("Failed to reset password")
      }

      if (!verified) {
         throw new BadRequestException("Invalid verification code")
      }

      try {
         hash = await generatePasswordHash(password)
         await this.userService.setPasswordHash(userId, hash)
      } catch (error) {
         throw new InternalServerErrorException("Failed to update password")
      }

      return {
         statusCode: 200,
         message: "Password has been changed"
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
      let result: ObjectId, imageId: string

      try {
         result = await this.userService.uploadImage(req.locals.userId, file)
      } catch (error) {
         throw new InternalServerErrorException("Failed to upload your profile image")
      }

      imageId = result.toString()

      return {
         statusCode: 201,
         result: { imageId },
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

   @Get('image/:id?')
   @Roles(Role.Anonymous)
   async getUserImage(@Res() res: Response, @Param('id') fileId: string, @Query('seed') seed: string = 'IM') {
      let image: GridFSBucketReadStream

      try {
         if (typeof fileId === 'string' && fileId.length === 24) {
            image = await this.userService.getImage(fileId)
         } else {
            const svg = createAvatar(dicebearStyle, {
               seed,
               width: 300,
               height: 300,
               chars: 1,
               backgroundColorLevel: 800,
            })

            res.setHeader('Content-Type', 'image/svg+xml')
            return res.status(200).send(svg)
         }

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
