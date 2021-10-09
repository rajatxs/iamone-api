import { Module } from '@nestjs/common'
import { SocialServiceProvider } from './social-service.service'
import { SocialServiceController } from './social-service.controller'

@Module({
   providers: [SocialServiceProvider],
   controllers: [SocialServiceController],
   exports: [SocialServiceProvider],
})
export class SocialServiceModule {}