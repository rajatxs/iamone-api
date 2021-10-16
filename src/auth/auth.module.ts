import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import env from '@utils/env'
import { AuthService } from './auth.service'
import { AdminService } from '../admin/admin.service'
import { UserService } from '../user/user.service'
import { SocialRefService } from '../social-ref/social-ref.service'

@Global()
@Module({
   imports: [
      JwtModule.registerAsync({
         useFactory: () => ({
            secret: env.jwtPrivateKey,
         })
      })
   ],
   providers: [
      AuthService,
      AdminService,
      SocialRefService,
      UserService
   ],
   exports: [
      AuthService,
      AdminService,
      SocialRefService,
      UserService
   ]
})
export class AuthModule { }
