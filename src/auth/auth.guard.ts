import {
   BadRequestException,
   CanActivate,
   ExecutionContext,
   Injectable,
   InternalServerErrorException,
   NotFoundException,
} from '@nestjs/common'
import { UserAuthTokenPayload } from './auth.interface'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { Request } from 'express'
import { ObjectId } from 'mongodb'

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(
      private readonly userService: UserService,
      private readonly authService: AuthService,
   ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = <Request>context.switchToHttp().getRequest()
      let authHeader: string, authToken: string, id: ObjectId
      let payload: UserAuthTokenPayload

      authHeader = request.header('Authorization')
      if (!authHeader) {
         throw new BadRequestException('Require authorization token')
      }

      authToken = authHeader.split(' ')[1]
      if (!authToken) {
         throw new BadRequestException('Missing authorization token')
      }

      try {
         payload = await this.authService.verifyUserAuthToken(authToken)
      } catch (error) {
         throw new InternalServerErrorException('Invalid authorization token')
      }

      id = new ObjectId(payload.id)

      if (!payload.admin) {
         if (!this.userService.has(id)) {
            throw new NotFoundException('Account not found')
         }

         request.locals.userId = id
      }

      return true
   }
}
