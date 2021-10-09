import { Module } from '@nestjs/common'
import { SocialServiceModule } from '../social-service/social-service.module'
import { AuthModule } from '../auth/auth.module'
import { UserModule } from '../user/user.module'
import { SocialRefService } from './social-ref.service'
import { SocialRefController } from './social-ref.controller'

@Module({
  imports: [AuthModule, SocialServiceModule, UserModule],
  providers: [SocialRefService],
  controllers: [SocialRefController]
})
export class SocialRefModule { }
