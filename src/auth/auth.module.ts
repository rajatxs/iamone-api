import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import env from '@utils/env'
import { AuthService } from './auth.service'
import { AdminService } from '../admin/admin.service'
import { AdminModule } from '../admin/admin.module'
import { UserService } from '../user/user.service'
import { UserModule } from '../user/user.module'

@Module({
   imports: [
      JwtModule.registerAsync({
         useFactory: () => ({
            secret: env.jwtPrivateKey,
         })
      }),
      forwardRef(() => AdminModule),
      forwardRef(() => UserModule)
   ],
   providers: [
      AuthService,
      AdminService,
      UserService
   ],
   exports: [
      AuthService,
   ]
})
export class AuthModule { }
