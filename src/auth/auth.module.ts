import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { AuthService } from './auth.service'
import { JwtConfigService } from './auth-config.service'

@Module({
  imports: [
    JwtModule.registerAsync({ useClass: JwtConfigService }), 
    forwardRef(() => UserModule)
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
