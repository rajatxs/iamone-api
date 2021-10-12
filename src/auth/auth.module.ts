import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { AdminModule } from '../admin/admin.module'
import { AuthService } from './auth.service'
import env from '@utils/env'

@Module({
   imports: [
      JwtModule.registerAsync({
         useFactory: () => ({
            secret: env.jwtPrivateKey,
         }),
      }),
      forwardRef(() => UserModule),
      forwardRef(() => AdminModule)
   ],
   providers: [AuthService],
   exports: [AuthService],
})
export class AuthModule {}
