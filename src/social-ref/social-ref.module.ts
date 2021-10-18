import { Module } from '@nestjs/common'
import { SocialServiceModule } from '../social-service/social-service.module'
import { SocialRefService } from './social-ref.service'
import { SocialRefController } from './social-ref.controller'

@Module({
  imports: [SocialServiceModule],
  providers: [SocialRefService],
  controllers: [SocialRefController],
  exports: [SocialRefService]
})
export class SocialRefModule { }
