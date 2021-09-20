import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { JwtConfigService } from './auth-config.service'

@Module({
  imports: [
    JwtModule.registerAsync({ useClass: JwtConfigService })
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
