import {
   BadRequestException,
   CanActivate,
   ExecutionContext,
   ForbiddenException,
   Injectable,
   NotFoundException,
   UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { Role } from './role.enum'
import { ROLES_KEY } from './role.decorator'
import { AuthTokenPayload } from './auth.interface'
import { AuthService } from './auth.service'
import { AdminService } from '../admin/admin.service'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(
      private readonly reflector: Reflector,
      private readonly adminService: AdminService,
      private readonly userService: UserService,
      private readonly authService: AuthService,
   ) { }

   /** Extract auth token from 'Authorization' header */
   protected extractAuthToken(request: Request): string {
      let authHeader: string, authToken: string

      authHeader = request.header('Authorization')
      if (!authHeader) {
         throw new BadRequestException('Require authorization token')
      }

      authToken = authHeader.split(' ')[1]
      if (!authToken) {
         throw new BadRequestException('Missing authorization token')
      }

      return authToken
   }

   /** Sanitize token payload  */
   protected sanitizePayload(payload: AuthTokenPayload) {
      payload.id = new ObjectId(payload.id)

      return payload
   }

   /** Verify auth token and returns payload */
   protected async verifyAuthToken(token: string): Promise<AuthTokenPayload> {
      let payload: AuthTokenPayload

      try {
         payload = await this.authService.verifyUserAuthToken(token)
      } catch (error) {
         throw new UnauthorizedException('Invalid authorization token')
      }

      payload = this.sanitizePayload(payload)

      return payload
   }

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = <Request>context.switchToHttp().getRequest()
      const [role] = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
         context.getHandler(),
         context.getClass()
      ])
      let token: string, payload: AuthTokenPayload

      if (role === Role.Anonymous) {
         return true
      }

      token = this.extractAuthToken(request)
      payload = await this.verifyAuthToken(token)

      switch (role) {
         case Role.Admin: {
            if (!payload.admin) {
               throw new ForbiddenException("You don't have access")
            }

            if (await this.adminService.has(payload.id) === false) {
               throw new NotFoundException('Account not found')
            }

            request.locals.adminId = <ObjectId>payload.id
            break
         }

         case Role.User: {
            if (await this.userService.has(payload.id) === false) {
               throw new NotFoundException('Account not found')
            }

            request.locals.userId = <ObjectId>payload.id
            break
         }

         default:
            return false
      }

      return true
   }
}
