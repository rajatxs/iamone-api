import { Module, MiddlewareConsumer } from '@nestjs/common'
import { TemplateService } from './template.service'
import { SocialServiceProvider } from '../social-service/social-service.service'
import { TemplateMiddleware } from './template.middleware'

@Module({
  providers: [TemplateService, SocialServiceProvider]
})
export class TemplateModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TemplateMiddleware)
      .forRoutes(':username')
  }
}
