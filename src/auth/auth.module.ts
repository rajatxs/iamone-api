import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import env from '@utils/env'
import { AuthService } from './auth.service'
import { AdminService } from '../admin/admin.service'
import { UserService } from '../user/user.service'

@Global()
@Module({
   imports: [
      JwtModule.registerAsync({
         useFactory: () => ({
            secret: env.jwtPrivateKey,
         }),
      })
   ],
   providers: [
      AuthService,
      AdminService,
      UserService
   ],
   exports: [
      AuthService,
      AdminService,
      UserService
   ],
})
export class AuthModule { }
