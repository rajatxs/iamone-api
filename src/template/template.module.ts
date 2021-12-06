import { Module, MiddlewareConsumer } from '@nestjs/common'
import { TemplateService } from './template.service'
import { ClinkModule } from '../clink/clink.module'
import { ClinkService } from '../clink/clink.service'
import { SocialServiceProvider } from '../social-service/social-service.service'
import { SocialRefModule } from '../social-ref/social-ref.module'
import { SocialRefService } from '../social-ref/social-ref.service'
import { SocialServiceModule } from '../social-service/social-service.module'
import { UserModule } from '../user/user.module'
import { UserService } from '../user/user.service'
import { TemplateMiddleware } from './template.middleware'
import { PageConfigService } from '../page-config/page-config.service'
import { TemplateController } from './template.controller'

@Module({
  imports: [
    SocialRefModule, 
    SocialServiceModule, 
    ClinkModule,
    UserModule
  ],
  providers: [
    TemplateService,
    SocialRefService, 
    SocialServiceProvider, 
    ClinkService,
    UserService,
    PageConfigService
  ],
  controllers: [TemplateController],
})
export class TemplateModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TemplateMiddleware)
      .forRoutes(':username')
  }
}
