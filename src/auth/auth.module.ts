import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
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
   ],
   providers: [AuthService],
   exports: [AuthService],
})
export class AuthModule {}
