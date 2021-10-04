import { Controller, Post, Body, InternalServerErrorException, UsePipes, Logger, BadRequestException } from '@nestjs/common'
import { OkPacket } from 'mysql'
import { User } from './user.interface'
import { UserService } from './user.service'
import { JoiValidationPipe } from '@pipes/validation'
import { createSchema } from './user.schema'

@Controller('user')
export class UserController {
   private readonly logger = new Logger

   constructor(private readonly userService: UserService) { }

   @Post()
   @UsePipes(new JoiValidationPipe(createSchema))
   async registerNewUser(@Body() data: User): Promise<ApiResponse> {
      let packet: OkPacket, insertId: RowId
      
      // check username
      if (await this.userService.hasUsername(data.username)) {
         throw new BadRequestException("Account is already registered with given username")
      }

      // // check email 
      if (await this.userService.hasEmail(data.email)) {
         throw new BadRequestException('Account is already registered with given email address')
      }
      try {
         // for incoming request
         if ('password' in data) {
            data.password_hash = data['password']
            delete data['password']
         }

         packet = await this.userService.create(data)
         insertId = packet.insertId
      } catch (error) {
         this.logger.error(error)
         throw new InternalServerErrorException("Failed to create your account")
      }

      return {
         statusCode: 201,
         message: "Account created",
         result: { insertId }
      }
   }
}
