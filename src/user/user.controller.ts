import { 
   Controller, 
   Get,
   Req,
   Post, 
   Body, 
   InternalServerErrorException, 
   Logger, 
   UsePipes,
   BadRequestException, 
   NotFoundException
} from '@nestjs/common'
import { InsertOneResult } from 'mongodb'
import { Request } from 'express'
import { User, UserCredentials } from './user.interface'
import { UserService } from './user.service'
import { createSchema, verifySchema } from './user.schema'
import { JoiValidationPipe } from '@pipes/validation'
import { AuthService } from '../auth/auth.service'
import { RegisteredAuthTokenResponse } from '../auth/auth.interface'
import * as bcrypt from 'bcryptjs'

@Controller('user')
export class UserController {
   private readonly logger = new Logger

   constructor(
      private readonly userService: UserService,
      private readonly authService: AuthService
   ) { }

   @Post()
   @UsePipes(new JoiValidationPipe(createSchema))
   async registerNewUser(@Req() req: Request, @Body() data: User): Promise<ApiResponse> {
      let result: InsertOneResult, insertedId: any

      // check username
      if (await this.userService.hasUsername(data.username)) {
         throw new BadRequestException("Account is already registered with given username")
      }
      
      // check email 
      if (await this.userService.hasEmail(data.email)) {
         throw new BadRequestException('Account is already registered with given email address')
      }

      try {
         data.httpRequestId = req.locals.requestId
         data.passwordHash = data['password']
         delete data['password']

         result = await this.userService.create(data)
         insertedId = result.insertedId
         this.logger.log(`User created ${insertedId}`)
      } catch (error) {
         this.logger.error(error)
         throw new InternalServerErrorException("Failed to create your account")
      }

      return {
         statusCode: 201,
         message: "Account created",
         result: { insertedId }
      }
   }

   @Post('token')
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
      } catch(error) {
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
         this.logger.log("Error while decode user password", error)
         throw new InternalServerErrorException("Failed to decrypt your credentials")
      }

      if (!isPasswordCorrect) {
         throw new BadRequestException("Incorrect password")
      }

      // register auth token
      try {
         result = await this.authService.registerNewUserAuthToken({ userId: user._id }, user.username)
      } catch (error) {
         this.logger.log("Error while registering new user auth token", error)
         throw new InternalServerErrorException("Failed to initialize your login session")
      }

      return {
         statusCode: 201,
         message: "Auth token generated",
         result
      }
   }
}
